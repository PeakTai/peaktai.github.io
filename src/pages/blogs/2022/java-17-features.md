### 密封类正式版本

经过两个预览版，密封类最终确定下来了，和 Java 16 中二次预览版在功能上没有任何区别。

```java
public sealed interface ConstantDesc
    permits String, Integer, Float, Long, Double,
            ClassDesc, MethodTypeDesc, DynamicConstantDesc { ... }
```

密封类用于限制类或接口只允许指定的子类来继承或实现，适合于不希望外部扩展功能的组件来增加限制。

### switch 模式匹配（预览）

switch 也可以匹配实例的类型了，之前 16 版本中增加的模式匹配只能在条件语句 if 中使用，现在可以用在
switch 中了。

旧版本的代码：

```java
if (o instanceof String) {
    String s = (String)o;
    ... use s ...
}
```

16 中新增的模式匹配:

```java
if (o instanceof String s) {
    ... use s ...
}
```

switch 模式匹配：

```java
return switch (o) {
    case Integer i -> String.format("int %d", i);
    case Long l    -> String.format("long %d", l);
    case Double d  -> String.format("double %f", d);
    case String s  -> String.format("String %s", s);
    default        -> o.toString();
};
```

空值也是可以匹配并进行处理的：

```java
switch (s) {
   case null         -> System.out.println("Oops");
   case "Foo", "Bar" -> System.out.println("Great");
   default           -> System.out.println("Ok");
}
```

### DatagramSocket 可以直接加入组播

DatagramSocket 增加了 joinGroup 和 leaveGroup 方法用于加入和离开组播（multicast），
这使得 DatagramSocket 可以方便的用于组播应用，在此之前只能使用 MulticastSocket 。

```java
 DatagramSocket socket = new DatagramSocket(null);
socket.setReuseAddress(true);
socket.bind(new InetSocketAddress(6789)); // 绑定地址
// 加入组 228.5.6.7
InetAddress mcastaddr = InetAddress.getByName("228.5.6.7");
InetSocketAddress group = new InetSocketAddress(mcastaddr, 0);
NetworkInterface netIf = NetworkInterface.getByName("wlan0");
socket.joinGroup(group, netIf);
byte[] msgBytes = new byte[1024];
DatagramPacket packet = new DatagramPacket(msgBytes, msgBytes.length);
socket.receive(packet);
// ....
// 离开组
socket.leaveGroup(group, netIf);
```

### 增强伪随机数字生成

为所有已经存在和新的伪随机数算法，提示了统一的随机数生成接口 RandomGenerator。

```java
RandomGenerator randomGenerator = RandomGenerator.of("L32X64MixRandom");
int randomInt = randomGenerator.nextInt();
System.out.println("randomInt = " + randomInt);
```

### 在 macos 上提供对 UserDefinedFileAttributeView 的支持

文件系统已经在 macos 提供了获取扩展属性的实现，通过 UserDefinedFileAttributeView 可获取文件扩展属性的视图。

```java
Files.getFileStore(Paths.get( " ./ " )).supportsFileAttributeView(UserDefinedFileAttributeView.class)
```

在之前的版本，上面的代码在 macos 上返回 false，下面的代码返回 null。

```java
Files.getFileAttributeView(Paths.get( " / " ), UserDefinedFileAttributeView.class)
```

### Ideal Graph Visualizer (IGV) 的现代化

Ideal Graph Visualizer (IGV) 是一个可以展现 C2 编译器 just-in-time (JIT) 中间过程的工具。
要可看图表，可在运行程序的时候添加参数 `-XX:PrintIdealGraphLevel=level`和`-XX:PrintIdealGraphFile=filename` 来生成
图表文件，然后导入 IGV 查看。

PrintIdealGraphLevel 的各个等级含义：

- 0: no output, the default
- 1: dumps graph after parsing, before matching, and final code (also dumps graphs for failed compilations, if available)
- 2: more detail, including after loop opts
- 3: even more detail
- 4: prints graph after parsing every bytecode (very slow)

也可以不生成文件，先启动 IGV ,JVM 启动后会自动连接，通过参数 -XX:PrintIdealGraphAddress= 和 -XX:PrintIdealGraphPort= 可以自定义 IGV 的服务地址。

我电脑上装的 openjdk 17 ，尝试了下，没有成功，报了下面的错，看样子这个功能不是给正式版本使用的。
反正目前还用不着，没有再深入研究。

```
Error: VM option 'PrintIdealGraphLevel' is notproduct and is available only in debug version of VM.
Error: Could not create the Java Virtual Machine.
Error: A fatal exception has occurred. Program will exit.
```

最后这次更新的现代化内容：

- 支持运行在 JDK 15 上（IGV 基于 Netbeans IDE 实现，支持程度和 Netbeans IDE 有关，实测 jdk8 和 jdk17 都能把 IGV 跑起来）
- 更快的，基于 maven 的构建系统
- 稳定化块形成、组移除和节点跟踪
- 默认过滤器中的着色和节点分类更直观
- 以更自然的行为方式快速排名节点的搜索

### javadoc 在错误信息中增加来源的详情

当 JavaDoc 在源文件中报告错误时，将会显示问题源码的行数，并使用脱字符标（^）记在行中的具体位置，类似于编译诊断的信息。

### javadoc 新增页面 ”New API“，优化页面 "Deprecated"

JavaDoc 再走可以生成一个概括一个 API 变化的摘要页面。通过添加参数 --since 启用，
命令会查找 @since 标签来生成新页面，通过 --since-label 参数可以设置新页面的标题。
在废弃条目的摘要页面，条目可以按照废弃的版本进行分组查看。

### 外部函数和内存 API（孵化功能）

提供了一套 api 可以调用外部库和进程，而不必使用脆弱和危险的 JNI。外部调用的的相关功能
之前的版本就有添加，到 17 仍然是孵化版本，目前仍然不成熟。

### Console 字符集 api

java.io.Console 增加新方法用来取字符集的。

```java
Console console = System.console();
if(console!=null){
    System.out.println(console.charset());
}
```

### JFR 增加反序列化事件

JFR（JDK Flight Recorder ）新增加事件 jdk.Deserialization，当运行中的程序试图对一个对象进行反序列化时触发，
默认关闭。

### 针对上下文环境的反序列化过滤器

通过类 ObjectInputFilter.Config 可以设置或获取 JVM 范围内的反序列化过滤器，相关方法定义：

```java
/**
 * Return the JVM-wide deserialization filter factory.
 *
 * @return the JVM-wide serialization filter factory; non-null
 */
public static BinaryOperator<ObjectInputFilter> getSerialFilterFactory();

/**
 * Set the JVM-wide deserialization filter factory.
 *
 * The filter factory is a function of two parameters, the current filter
 * and the next filter, that returns the filter to be used for the stream.
 *
 * @param filterFactory the serialization filter factory to set as the
 * JVM-wide filter factory; not null
 */
public static void setSerialFilterFactory(BinaryOperator<ObjectInputFilter> filterFactory);
```

反序列化过滤器机制可以让你防止反序列化带来的漏洞。如果不想设置全局的，只是简单的自定义，可以通过 ObjectInputStream 的方法 setObjectInputFilter 进行设置。

下面是一个 `BinaryOperator<ObjectInputFilter>` 实现的例子。

```java
public class FilterInThread implements BinaryOperator<ObjectInputFilter> {

    // ThreadLocal to hold the serial filter to be applied
    private final ThreadLocal<ObjectInputFilter> filterThreadLocal = new ThreadLocal<>();

    // Construct a FilterInThread deserialization filter factory.
    public FilterInThread() {}

    /**
     * The filter factory, which is invoked every time a new ObjectInputStream
     * is created.  If a per-stream filter is already set then it returns a
     * filter that combines the results of invoking each filter.
     *
     * @param curr the current filter on the stream
     * @param next a per stream filter
     * @return the selected filter
     */
    public ObjectInputFilter apply(ObjectInputFilter curr, ObjectInputFilter next) {
        if (curr == null) {
            // Called from the OIS constructor or perhaps OIS.setObjectInputFilter with no current filter
            var filter = filterThreadLocal.get();
            if (filter != null) {
                // Prepend a filter to assert that all classes have been Allowed or Rejected
                filter = ObjectInputFilter.rejectUndecidedClass(filter);
            }
            if (next != null) {
                // Prepend the next filter to the thread filter, if any
                // Initially this is the static JVM-wide filter passed from the OIS constructor
                // Append the filter to reject all UNDECIDED results
                filter = ObjectInputFilter.merge(next, filter);
                filter = ObjectInputFilter.rejectUndecidedClass(filter);
            }
            return filter;
        } else {
            // Called from OIS.setObjectInputFilter with a current filter and a stream-specific filter.
            // The curr filter already incorporates the thread filter and static JVM-wide filter
            // and rejection of undecided classes
            // If there is a stream-specific filter prepend it and a filter to recheck for undecided
            if (next != null) {
                next = ObjectInputFilter.merge(next, curr);
                next = ObjectInputFilter.rejectUndecidedClass(next);
                return next;
            }
            return curr;
        }
    }

    /**
     * Apply the filter and invoke the runnable.
     *
     * @param filter the serial filter to apply to every deserialization in the thread
     * @param runnable a Runnable to invoke
     */
    public void doWithSerialFilter(ObjectInputFilter filter, Runnable runnable) {
        var prevFilter = filterThreadLocal.get();
        try {
            filterThreadLocal.set(filter);
            runnable.run();
        } finally {
            filterThreadLocal.set(prevFilter);
        }
    }
}
```

### 增加新的系统属性获取原生字符集名称

新增加 native.encoding 来获取系统的原生字符集名称。

```java
// windows 系统默认设置会输出 GBK
System.out.println(System.getProperty("native.encoding"));
```

### 添加 java.time.InstantSource

引入新接口 java.time.InstantSource ，新接口是 java.time.Clock 的抽象，只关注当前时刻，
不涉及时区，java.time.Clock 必须要指定时区。

```java
InstantSource system = InstantSource.system();
// 等价于 System.currentTimeMillis()
System.out.println(system.millis());
InstantSource oneDayLater = InstantSource.offset(system, Duration.ofDays(1L));
System.out.println(oneDayLater.millis());
```

### 十六进制格式化和解析

引入工具类 java.util.HexFormat 提供了十六进制和格式化和解析。

```java
System.out.println(HexFormat.fromHexDigits("5e"));//94
// 获取字符在十六进制中表示的数据
System.out.println(HexFormat.fromHexDigit('A'));// 10
byte b = 94;
System.out.println(HexFormat.of().toHexDigits(b));// 5e
System.out.println(HexFormat.fromHexDigit('X'));// 异常 ：not a hexadecimal digit
```

###　实验性功能编辑器黑洞（ Compiler Blackholes ）

这个功能对底层的基准测试很有用，它可以防止死代码（ dead-code ）被消除。

例如下面这段代码：

```java
public void test(int x,int y){
    int z = x + y;
}
```

由于方法没有返回结果，方法内的代码会被消除，编译后的字节码文件中并没有方法内的内容，也就不会在运行时执行。
编译器的优化可以提升程序的性能，但是如果你想要做基准测试，这可能不是你想要的效果，因为观察测试的过程比程序执行的结果重要。那么现在可以通过命令行参数启动编译黑洞，来避免这个优化：`-XX:CompileCommand=blackhole,<method>`。

JMH 已经可以自动检查，当指令可用时，使用这个功能。JMH 是一款由 OpenJDK 开发的基准测试工具，在之前都是通过
Blackhole::consume() 方法消除死代码，这种方式产生副作用，会产生额外的消耗。

### 基于 vtable 的 CHA 实现

引入一个新的类层级分析（Class Hierarchy Analysis ，简写 CHA）实现，以提升对抽象和默认方法的处理为特色，
改进 JIT 编译器的内联决策，新实现取代了原来的版本成为默认实现。

为了帮助诊断错误是否与新版本有关，原来的实现可以通过参数来切换：`-XX:+UnlockDiagnosticVMOptions -XX:-UseVtableBasedCHA` ，原本的实现会在未来删除。

新版本的实现在查询目标方法时会依赖于 vtable 的信息。vtable 是 c++ 中的虚拟表（virtual table），
用于查找函数，解决函数通过动态或延迟绑定的方式调用的问题。

### macOS/AArch64 架构移植

Jdk 终于可以支持 Mac m1 了，从 17 版本开始，可以下载官方的 macOS/AArch64 版本 JDK。
想使用更早的版本，只能寻找第三方的 JDK 了，比如 Azul JDK。如果你使用了 Idea 来做 Java
开发， Idea 很早就支持了 m1 版本的 Mac，使用内置 JDK 即可，非常方便。

### 统一日志支持异步日志刷新

为了避免线程在使用统一日志（Unified Logging）造成令人讨厌的延迟，用户可以请求统一日志系统
使用异步操作模式，使用参数 -Xlog:async 开启。在异步模式下，所有的日志都会以消息队列的形式存放于一个缓冲区内，
缓冲区耗尽，则会丢弃入队的消息。通过参数 -XX:AsyncLogBufferSize=<bytes> 可设置缓冲区大小。

### Keytool -genkeypair 命令支持指定签名者

keytool 工具新增加 -signer 和 -signerkeypass 两个参数到 -genkeypair 命令中。-genkeypair 选项指定
签名者 PrivateKeyEntry（ketstore 中的私钥条目） 别名，-signerkeypass 指定用于保护签名者私钥的密码。
新特性主要是为了支持密钥协商算法来生成公钥。

### SunJCE 对 AES 加密提供了 KW 和 KWP 模式

SunJCE 进一步增强，支持了 RFC 3394 和 RFC 5649，也因此增加了 KW 和 KWP 两种块密码模式。

### 新的 SunPKCS11 配置项

SunPKCS11 provider 添加了新的配置属性，可以更好的控制本地资源的使用。为了更好的
管理本地资源，新加选项用来控制本地引用的清理频率以及退出登录后是否销毁本地的 PKCS11 令牌。

三个新的配置项：

1. destroyTokenAfterLogout ，(boolean 类型，默认 false)，设置为 true ，当 java.security.AuthProvider.logout() 调用，底层的令牌对象会被销毁，资源也会被释放。
2. cleaner.shortInterval，(integer 类型，默认 2000，单位毫秒)，忙碌期间清理本地引用的周期。
3. cleaner.longInterval，(integer类型, 默认 60000, 单位毫秒)，非忙碌期间清理本地引用的周期。

要使用 SunPKCS11 需要先安装 PKCS11 动态库到本地，然后进行配置。下面是简单的示例：

pkcs.cfg 配置：

```conf
library = C:\mypkcs11.dll
name = SunPKCS11-FooAccelerator
destroyTokenAfterLogout = true
cleaner.shortInterval = 2000
cleaner.longInterval = 60000
```

name 和 library 必填，library 是本地 pkcs11 的链接库位置。

```java
AuthProvider sunpkcs11 = (AuthProvider) Security.getProvider("SunPKCS11");
sunpkcs11.configure("C:\\pkcs.cfg");
```

官方参考文档：[PKCS#11 Reference Guide](https://docs.oracle.com/javase/9/security/pkcs11-reference-guide1.htm#JSSEC-GUID-30E98B63-4910-40A1-A6DD-663EAF466991)

### javadoc 包摘要页增加关联的包（Related Packages）

Package Summary 中增加 Related Packages 章节，相关包的的合集是根据命名来决定的，
可能会包含以下的部分：

1. 父包
2. 兄弟包
3. 子包

![Related Packages](/assets/blogs/2022/java-17-features/related-packages.png)

### JDK 内部强封装

将所有 JDK 内部元素强封装，除了 critical internal APIs，critical internal APIs 如下：

- sun.misc.{Signal,SignalHandler}
- sun.misc.Unsafe (The functionality of many of the methods in this class is available via variable handles (JEP 193).)
- sun.reflect.Reflection::getCallerClass(int) (The functionality of this method is available in the stack-walking API defined by JEP 259.)
- sun.reflect.ReflectionFactory
- com.sun.nio.file.{ExtendedCopyOption,ExtendedOpenOption, ExtendedWatchEventModifier,SensitivityWatchEventModifier}

也因此 --illegal-access 选项被废弃了，如果使用了会抛出警告，并且也不会生效。
对于已经存在的代码，必须要使用 jdk 内部的类、方法或成员变量，仍然可以使用 --add-opens
来访问 jdk 内部 api ，让代码继续运行。

### 其它移除功能

- 将 Telia Company's Sonera Class2 证书从 cacerts 信任库中移除
- sun.misc.Unsafe::defineAnonymousClass 被删除，可使用 MethodHandles 相关 api 替代
- 删除 RMI Activation，从 java8 开始就已经废弃了部分，15 中标记为 deprecated，在 17 中删除
- 移除实验性质的 AOT 和 JIT 编译器
