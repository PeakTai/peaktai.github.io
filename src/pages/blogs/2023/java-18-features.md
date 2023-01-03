### 默认 UTF-8

从 JDK8 开始，UTF-8 就是 Java SE API 的默认字符集。java.nio.charset.Charset#defaultCharset() 现在默认返回 UTF-8 。现在 Java 的标准 API 都默认使用 UTF-8 编码，目的是让 Java 程序可预测和可移植。在之前，
读取同一个文件，在不同的操作系统上可能会有不同的结果，出现乱码的情况。

### 简单的 web 服务器

引入 jwebserver ,一个简单的命令行工具,用于快速开启一个静态 http 服务.可用于测试,教学等目的.

```
jwebserver [-b 绑定地址] [-p 端口] [-d 目录]
```

这个工具感觉挺鸡肋的,很多 ide 都有 http server 相关的插件或自带静态服务功能,用起来
比使用命令方便多了.

### 重新实现核心的方法反射

重新实现方法反射中的 `java.lang.reflect.Method`, `Constructor`,和 `Field`.

之所以要重新实现,主要是之前的实现不太好,旧的实现存在三种机制来完成反射:

- 虚拟机本地方法
- 为方法和构造器动态生成字节码占桩代码(stubs),通过 Unsafe 访问成员变量
- Method handles

现在的实现依赖于虚拟机生成字节码,并用子类 jdk.internal.reflect.MagicAccessorImpl 包装,
产生了以下的问题:

- 可访问性是宽松的,以便于这些类可以访问到本不能访问的别的类的字段和方法.
- 校验被禁用,以便于可以反射调用 Object::clone.原本 protected 修饰的方法或构造器只有子类才可以调用.
- 使用一个不遵守规范的类加载器来处理安全和兼容性问题.

新的实现方法直接通过 method handles 调用指定的反射对象,仅在虚拟机启动的早期使用虚拟机的本地反制机制,
在 method-handle 机制初始化之前.新的实现将减少新版本语言特性升级反射功能的成本,在未来会精简虚拟机,移除
MagicAccessorImpl .

通过参数 -Djdk.reflect.useDirectMethodHandle=false 可以继续使用旧的实现,但是旧的实现会在未来版本删除.

### 地址解析 SPI

引入了一套域名地址解析的 SPI ,因此 java.net.InetAddress 可以使用平台内置解析器以外的解析器.
新的 SPI 允许替换掉操作系统本地的解析器(系统自带的 hosts 配置).

### java API 文档支持代码片段

为标准的 Doclet 引入新的标签 @snippet ,简化包含示例代码的 api 文档.

在之前,可能要使用 html 的 pre 标签加 @code 标签,像这样:

```
<pre>{@code
    lines of source code
}</pre>
```

现在可以使用 @snippet 标签:

```java
/**
 * The following code shows how to use {@code Optional.isPresent}:
 * {@snippet :
 * if (v.isPresent()) {
 *     System.out.println("v: " + v.get());
 * }
 * }
 */
```

引入 @snippet 的目的是:

- 促进和校验源码片段,提供 api 访问这些片段,便 javadoc 和相关的工具可以更容易的获取
- 更加现代化的模式,支持语法高亮(@highlight 标签)等
- 让 ide 可以更好的识别和编辑

实测 intellij idea 是可以支持的,不仅对 @snippet 内的代码有语法高亮,还有代码自动补全.

![ide 中的 @snippet 代码补全](/assets/blogs/2022/java-18-features/java-doc-sinppet-idea.png)

我也测了下 vscode,java 插件并没有提供支持,和普通的注释内容没有区别.

### 矢量 api (孵化)

引入一个 api 用于表达矢量计算,依赖于运行时的 GPU 指令支持.

### 外部函数和内存 api 二次孵化

引入一套 api 让 java 程序可以在运行时和外部的代码与数据交互.日常开发用到的可能比较少,
目前还在孵化中,api 可能会在后续版本中发生变化,删除也有可能,最好不要使用相关功能.

### switch 模式匹配 (第二次预览)

switch 匹配增强,可以和类型匹配,支持 null 和数据等.目前最新的 java19 中也还没有发布正式版本.

下面是简单的示例:

```java
static void typeTester(Object o) {
    switch (o) {
        case null     -> System.out.println("null");
        case String s -> System.out.println("String");
        case Integer s -> System.out.println("Integer");
        case int[] ia -> System.out.println("Array of ints of length " + ia.length);
        default       -> System.out.println("Something else");
    }
}
```

### ZGC,SerialGC,ParallelGC 支持字符串消除

Java 程序大约有 25% 的堆内存被字符串消耗,此外这些字符串有大约一半是重复的,
这些重复的字符串浪费了很多空间.

字符串 String 有两个属性:

```
private final char[] value;
private int hash;
```

value 字段对外不可见的,对于相同的字符串,只要将 value 重新赋值给另一个字符串就可以
消除重复,并且外部调用处是不受影响的,可以正常使用多个字符串实例.所以,字符串消除并不能
消除字符串对象,只是对内部的 value 做了处理,不会对现有的代码产生影响.

### 从 Filer 中传递始发元素(Originating Elements)到 JavaFileManager

javax.tools.JavaFileManager 新增加了两个方法 getJavaFileForOutputForOriginatingFiles 和 getFileForOutputForOriginatingFiles,用于创建新文件时带上指定的始发文件.javax.annotation.processing.Filer
可以使用这些方法来创建新文件,以便于传递的文件中包含始发元素.

### Charset.forName() 采用默认值回退

Charset.forName() 重载方法支持传入默认值,当给定的字符名称不被支持时,回退到默认值.

```java
Charset charset = Charset.forName("utf-9", StandardCharsets.UTF_8);
System.out.println("charset = " + charset);// charset = UTF-8
```

### 引入新的系统属性 java.properties.date

引入新的系统属性 java.properties.date ,支持程序控制调用 java.util.Properties::store
时使用的默认日期注释.

```java
Properties properties = new Properties();
properties.setProperty("host", "java.com");
StringWriter writer = new StringWriter();
properties.store(writer, "test configuration");
System.out.println(writer);
```

默认输出会带上当前时间的日期注释(第二行):

```properties
#test configuration
#Mon Nov 28 19:20:58 CST 2022
host=java.com
```

命令行添加系统属性 `-Djava.properties.date=2022-11-30` 后:

```properties
#test configuration
#2022-11-30
host=java.com
```

### Messager 接口添加方法: printError, printWarning, 和 printNote

注解处理器的 Messager 接口添加三个方法: printError, printWarning, 和 printNote, 用于分别直接报告不同的程度
的信息.

### Elements 增加获取最外层元素方法

javax.lang.model.util.Elements 增加新方法 getOutermostTypeElement 用于获取最外层的元素.
同时还增加了新方法 getFileObjectOf(Element) 获取元素映射的文件对象.

```java
@SupportedAnnotationTypes("java10.process.TestAnno")
@SupportedSourceVersion(SourceVersion.RELEASE_18)
public class MyAnnotationProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        Elements elements = processingEnv.getElementUtils();
        for (TypeElement annotation : annotations) {
            Set<? extends Element> els = roundEnv.getElementsAnnotatedWith(annotation);
            for (Element el : els) {
                // getOutermostTypeElement
                TypeElement root = elements.getOutermostTypeElement(el);
                // getFileObjectOf
                JavaFileObject file = elements.getFileObjectOf(el);
            }
        }
        return true;
    }
}
```

### SourceVersion 与 Runtime.Version 朴素映射

枚举 SourceVersion 新方法 runtimeVersion 和 valueOf 来与 Runtime.Version 相互转换.

```java
Runtime.Version runtimeVersion18 = SourceVersion.RELEASE_18.runtimeVersion();
System.out.println("runtimeVersion18 = " + runtimeVersion18)

Runtime.Version runtimeVersion = Runtime.version();
SourceVersion sourceVersion = SourceVersion.valueOf(runtimeVersion);
System.out.println("sourceVersion = " + sourceVersion);
```

### 提升编译回放

编译回放是一个 JVM 调试功能,用于 C1 或 C2 编辑器崩溃的重现.
此次更新编译回放功能更稳定了,主要提升:

- 尽可能的支持隐藏类,允许动态调用,MethodHandles 和 lambada 等情况可以回放成功
- 支持 C1 编译器导出回放
- 提升内嵌支持
- 大量 bug 2 修复

### 使卡表(card table)的卡片大小可配置

增加了新的选项 -XX:GCCardSizeInBytes 用于配置卡表(card table)中卡片(card table entry)的大小,之前的版本是固定 512 字节的.
可允许使用的值是 128,256 和 512,10242 仅在 64 位系统中允许使用,默认值仍然是 512 字节.

卡片大小会影响 GC 时搜索一个区域内需要被转移的引用所需要的工作量.具体对性能的影响是不确定的,较小的值,
会给出更精确的引用信息,经常会减少使垃圾回收工作量.但是同时较小的卡片尺寸也会导致存储这些信息使用更多的内存,
降低垃圾回收时的管理工作的性能.

#### 关于卡表

垃圾回收器如果不需要处理整个堆区域,就需要知道不回收区域内有哪些指针是提向要回收区域的.在 young gc 的过程中,要知道的就是老年代有哪些指针指向年轻代中的对象.用于保存
这些指向信息的的数据结构叫做记忆集(remembered set).
卡表是一个特殊的记忆集(remembered set),每一个卡片表示的是堆内存地址范围,也就是一块堆内存区域.卡表中的卡片有个 dirty value 用于存储指针信息,在处理卡片时,如果 dirty value 为空可直接回收一片内存区域,提升效率.

### 允许 将 G1 的分区大小设置到 512MB

G1 回收器允许把分区的大小设置在 32MB 到 512MB,默认仍然是 32MB,通过参数 -XX:G1HeapRegionSize 可以设置更大.

在有非常大的堆内存情况下,更大的分区大小,可以减少内部分区管理负载,提升性能.

### JDK Flight Recorder Event for Finalization

新的 JFR (JDK Flight Recorder) 事件 jdk.FinalizerStatistics,表示类在运行时被终结,默认启用,使用选项 --finalization=disabled 可以禁用.
当一个实例拥有非空的 finalize() 方法才会触发 jdk.FinalizerStatistics 事件.

jdk.FinalizerStatistics 事件会统计覆写 finalize() 的类,类被终结次数,还有多少对象在堆上没有被终结.

### SunPKCS11 Provider 支持部分 PKCS#11 v3.0 的 API

新增加了对 C_GetInterfaceList, C_GetInterface, and C_SessionCancel 的支持.

### KeyStore 增加新方法 getAttributes

```java
KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
char[] keyStorePassword = "password123".toCharArray();
try (InputStream is = new FileInputStream("keystore.ks")) {
    keyStore.load(is,keyStorePassword);
    keyStore.getAttributes("alias");
}
```

### keytool 增加新选项 -version

```
$ keytool -version

keytool 18
```

### PKCS12 KeyStore 保存和加载支持密码为空

```java
KeyStore keyStore = KeyStore.getInstance("pkcs12");
try (InputStream is = new FileInputStream("keystore.ks")) {
    // password is null
    keyStore.load(is,null);
    //  keyStore.store(out,null);
}
```

#### finalize 方法被弃用

Object.finalize() 和 Enum.finalize() 已经被标记为待删除(forRemoval),将会在未来的版本中删除.随着一起废弃的还有
Runtime.runFinalization() 和 System.runFinalization().

```java
@Deprecated(since="9", forRemoval=true)
protected void finalize() throws Throwable { }
```

目的:

1. 帮助开发者了解 finalize 的危险
2. 使开发者准备好未来版本不再使用 finalize
3. 提供一个简单的工具,帮助检测对 finalize 的依赖

finalize 从 Java 1.0 开始就引入了,目的是为了避免资源泄漏,一个类可以在 finalize()
方法中释放掉占用的资源,当一个对象不可达时, GC 会在回收掉对象的内存前调用 finalize() .
但是不幸的是, finalize 有很多严重的缺陷:

- 无法预测的延迟,从对象不可达到 finalize 被执行是有很长的延迟,并且实际上 gc 也不保证 finalize 一定会执行.
- 无法约束行为,在 finalize 里可以做任何行为,甚至可以通过保存引用使对象不能被回收.
- 永远存在, finalize 没有一个注册机制,不管有用与否,每个类的实例都会有.即使用不上,也不能取消.
- 没有指定的线程,执行 finalize 的线程和顺序都是不确定的,无法控制.

总之, finalize 给程序的安全性和性能带来了很多问题,我们不应该在生产环境中去使用.
在 Java 18 中我们可以通过新的参数来禁用掉 finalize: --finalization=disabled .

### 内部类的封闭实例字段被省略

看下面的一个内部类的例子:

```java
class T {

    class I {
    }
}
```

在 18 之前,编译后会在内部类生成一个封闭的内部字段 this$0,引用外部类.

```java
class T {

    class I {
        private synthetic T this$0;
        I(T this$0) {
            this.this$0 = this$0;
        }
    }
}
```

从 jdk 18 开始, this$0 字段被省略.

```java
class T {

    class I {
        I(T this$0) {}
    }
}
```

这样处理会导致如果内部封闭的实例仅在内部类中使用,则会更快的被回收.避免当创建一个内部类并试图比封闭实例的
存活时间更长时,引发潜在内存泄漏问题.如果内部类不回收,封闭实例也会回收.
