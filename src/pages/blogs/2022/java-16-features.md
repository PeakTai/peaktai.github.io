Java 16 添加了许多 [孵化模块（incubator module）](https://openjdk.org/jeps/11)，大多是第一个迭代版本，
这些模块很多已经在后续的版本中被修改了，了解下就好，不要在生产环境中使用。

### 外部内存访问 API（Foreign-Memory Access API）

引入一套 API 允许 Java 程序安全和高效的访问外部内存，可替代 sun.misc.Unsafe 。
增加了一个孵化模块，名叫 `jdk.incubator.foreign`，有三个主要的抽象概念：

- MemorySegment 作为一段连续内存的模型
- MemoryAddress 作为地址模型，可以表示堆内存或堆外内存
- MemoryLayout 是对内存片段的编程式描述

下面是简单的代码示例：

```java
try (MemorySegment segment = MemorySegment.allocateNative(100)) {
  int sum = StreamSupport.stream(MemorySegment.spliterator(segment.withOwnerThread(null),seq_bulk),true)
      .mapToInt(slice -> {
          int res = 0;
          for (int i = 0; i < 100 ; i++) {
              res += MemoryAccess.getIntAtIndex(slice, i);
          }
          return res;
      }).sum();
}
```

在后面的版本中，这套 API 又进行了更新，上面的代码只能在 Java 版本中运行。

### 外部链接 API（Foreign Linker API）

引入一个提供静态类型的纯 Java 访问本地代码的 API，结合上面的外部内存访问 API 将大大简化绑定到本机库的其他容易出错的过程。

Java 在之前的版本中已经提供 JNI 方案来实现本地调用，但是使用麻烦，也很弱。JNI 要求开发 Java API,c 语言头文件，c 语言实现，即使有工具辅助，开发者也不得不通过多个工具链保持多平台的同步。于是，又出现了许多框架来填补这片空白，像 JNA、JNR、JavaCPP 等。Foreign Linker API 则可以将外部本地函数暴露为 method handle，使其可以直接使用 Java 代码调用，不需要像 JNI 一样编写胶水代码。

假设我们想要调用下面的标准库函数：

```c
size_t strlen(const char *s);
```

通过 CLinker 和 LibraryLookup 相关的 API 可以获取到 MethodHandle 对象。

```java
MethodHandle strlen = CLinker.getInstance().downcallHandle(
    LibraryLookup.ofDefault().lookup("strlen"),
    MethodType.methodType(long.class, MemoryAddress.class),
    FunctionDescriptor.of(C_LONG, C_POINTER)
);
```

除了 Downcalls 还有 Upcalls，可以将 Java 代码作为函数指针传递给外部本地函数，这里就不再多做介绍了。

Java 调用本地代码，我基本上从来没有在工作中使用过，一般普通的调用，可以使用 Java 的 command 调用。
一般的开发，这样的需求比较少，只有一些需要和底层紧密结合的程序才用的到，像 JavaFX 实现就需要编写 c 和 c++ 代码来调用底层的图形库。

### 默认对 JDK 内部做强封装

将所有 JDK 内部元素做了强封装，将程序对内部 api 的访问做了限制，已经存在的代码如果使用了内部的类、方法或字段，可能会无法运行，通过参数 `--illegal-access=permit` ，这个参数未来也会删除。

下面列出了部分示例代码，都是无法继续使用的，运行时会报异常：

```java
System.out.println(sun.security.util.SecurityConstants.ALL_PERMISSION);
```

```
Exception in thread "main" java.lang.IllegalAccessError: class Test
  (in unnamed module @0x5e481248) cannot access class
  sun.security.util.SecurityConstants (in module java.base) because
  module java.base does not export sun.security.util to unnamed
  module @0x5e481248
```

```java
var ks = java.security.KeyStore.getInstance("jceks");
var f = ks.getClass().getDeclaredField("keyStoreSpi");
f.setAccessible(true);
```

```
Exception in thread "main" java.lang.reflect.InaccessibleObjectException:
  Unable to make field private java.security.KeyStoreSpi
  java.security.KeyStore.keyStoreSpi accessible: module java.base does
  not "opens java.security" to unnamed module @6e2c634b
```

### 给基于值的类增加警告

将原始类型的包装类标记为 value-based，弃用它们的构造器，并给予弃用警告。对于 java 平台中任何使用基于值（value-based）的类实现不正当的同步行为给予警告。

```java
Double d = 20.0;
synchronized (d) { ... } // javac warning & HotSpot warning
Object o = d;
synchronized (o) { ... } // HotSpot warning
```

早在 Java 9 已经将包装类的构造器标记为弃用并在未来删除，由于原始类型是有缓存机制，构造出来的实例并不是
唯一（值相同有可能是同一个实例），用于同步是不可靠的。

### Unix domain sockets

在 java.nio.channels, SocketChannel, and ServerSocketChannel 中提供对 Unix domain sockets （AF_UNIX）的支持。

```java
SocketChannel.open(UnixDomainSocketAddress.of('path.sock'))
```

### java.time Formats 支持 Day Period

日期格式新增字母 B 表示一天中的时间段（day period），在类 java.time.format.DateTimeFormatter/DateTimeFormatterBuilder 中提供了支持。

```java
// 时间是 20:00，输出：晚上
DateTimeFormatter.ofPattern("B").format(LocalTime.now())
```

### Stream 新增 toList() 方法

toList() 方法相比之前使用 collect() 方便了很多。但是，也有可能造成源码不兼容的情况，比如说你写一个类来实现 Stream，
那么在这个类中就不能从别的地方静态引入 toList()，因为 toList() 会被认为是调用类自己的方法，
如果要使用 Collectors.toList() 只能使用全限定名。

### 向量 API （孵化）

增加一个孵化模块 `jdk.incubator.vector`，提供向量运算 API，在运行时编译为适当的硬件指令，提升运算速度。

```java
static final VectorSpecies<Float> SPECIES = FloatVector.SPECIES_256;

void vectorComputation(float[] a, float[] b, float[] c) {

    for (int i = 0; i < a.length; i += SPECIES.length()) {
        var m = SPECIES.indexInRange(i, a.length);
		// FloatVector va, vb, vc;
        var va = FloatVector.fromArray(SPECIES, a, i, m);
        var vb = FloatVector.fromArray(SPECIES, b, i, m);
        var vc = va.mul(va).
                    add(vb.mul(vb)).
                    neg();
        vc.intoArray(c, i, m);
    }
}
```


### 改进 CompileCommand

CompileCommand 参数有个 option 类型用于传递子命令集合，这些命令没有合法性检查，以致于如果有拼写错误命令会被忽略。现在的格式是：

```
-XX:CompileCommand=option,<method pattern>,<option name>,<value type>,<value>
```

现在所有的选项命令都作为普通命令按下面的格式传递：

```
-XX:CompileCommand=<option name>,<method pattern>,<value>
```

示例：

```
 -XX:CompileCommand=exclude,java/*.* -XX:CompileCommand=log,java*.*
```

### ZGC 并发栈处理

ZGC 现在可以并发进行线程栈处理了，所有的 JVM 中的 gc root 对象都会在 ZGC 的并发阶段被处理，取代之前的 stop-the-world 停顿。

### JFR 添加新事件 jdk.ObjectAllocationSample

jdk.ObjectAllocationSample 事件的引入允许始终在线和低开销的分配信息收集。

### 弹性元数据

及时的将 HotSpot 中无用的元数据(metaspace)内存还给操作系统，减少元数据的内存占用。


### jarsigner  保留 POSIX 文件权限和链接属性

jarsigner 是一个用于 jar 文件签名和校验的工具，新版本的 jarsigner 在签名后生成的新文件将
保留 POSIX 文件权限和链接属性。

### 密封类预览第二版

密封类（Sealed Classes）从 jdk15 开始添加了第一个预览版本，16 更新了第二个预览版本，在 17 中成为正式版本。
密封类的主要用途是对一个类或接口增加约束，可以限制哪些类才能继承或实现类和接口。

```java
public sealed class Rectangle extends Shape 
    permits TransparentRectangle, FilledRectangle {  }
```

### record 增强

放宽了嵌入限制，支持了方法、成员变量等在内部类中申明。

构造函数：

```java
record Range(int lo, int hi) {
    Range {
        if (lo > hi)  // referring here to the implicit constructor parameters
            throw new IllegalArgumentException(String.format("(%d,%d)", lo, hi));
    }
}
```

方法：

```java
record SmallPoint(int x, int y) {
  public int x() { return this.x < 100 ? this.x : 100; }
  public int y() { return this.y < 100 ? this.y : 100; }
}
```

局部申明，嵌入使用：

```java
List<Merchant> findTopMerchants(List<Merchant> merchants, int month) {
    // Local record
    record MerchantSales(Merchant merchant, double sales) {}

    return merchants.stream()
        .map(merchant -> new MerchantSales(merchant, computeSales(merchant, month)))
        .sorted((m1, m2) -> Double.compare(m2.sales(), m1.sales()))
        .map(MerchantSales::merchant)
        .collect(toList());
}
```

我倒是觉得 record 再扩展下去没有必要，也不怎么实用，反正我很少去用。

### instanceof 模式匹配

引进新语法支持在使用 instanceof 判定类型和同时申明一个转换好类型的变量。

```java
if (obj instanceof String s) {
   // s 相当于是 String s = (String) obj
}
```

还可以很方便的写一些逻辑运算：

```java
if (obj instanceof String s && s.length() > 5) {
    flag = s.contains("jdk");
}
```




### 打包工具

打包工具 jpackage 在 14 版本中被引入，在 15 中依然是孵化中的状态，在 16 中已经可以投入生产了。

工具支持原生包格式能够给用户一个自然的安装体验，格式包括：windows 上的 msi 和 exe , macOS 上的 pkg 和 dmg , linux 上的 deb 和 rpm 。
可以直接在命令行调用或者通过编码的方式，通过 ToolProvider 来使用。

部分使用示例：

```
jpackage --name myapp --input lib --main-jar main.jar

jpackage --name myapp --input lib --main-jar main.jar --main-class myapp.Main

jpackage --name myapp --input lib --main-jar main.jar --type pkg
```

### 部分被删除的特性

- 删除 java.awt.PeerFixer 
- 删除实验性质的 AOT 和 Graal JIT，JIT 编译器 Graal 无法再使用
- SunEC provider 不再支持一些已经淘汰的椭圆曲线算法