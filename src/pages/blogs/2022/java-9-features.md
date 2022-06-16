Spring Boot 3.0 M1 发布，正式弃用 Java 8，最低要求 Java 17。我自己一直在使用 java 8 ，新版本也只偶尔用用，有必要去好好了解一下。于是便决定结合官方资料，整理下 java 8 之后各个版本的主要特性。JDK 每个版本的更新内容都非常多，就从 9 开始吧。

### 模块系统

模块系统在包（package） 之上又增加了模块（module），通过 module-info.java 来设置依赖和导出的包（package），与 es6 类似。在 java 9中可以将程序打包成 jmod，取代之前的 jar。

新增加了 jlink 工具，可以将模块及其传递依赖组装起来，创建一个自定义的运行时，输出在指定的目录中。创建的目录中包含了 jre ，适合直接部署，内部的 jre 没有自动更新机制。

jdk 自身也拆分成为一系列模块，可以通过 jlink 组装出一个自定义的 jre 环境，让程序占用的空间更小。rt.jar 和 tools.jar 被移除。

### 新的版本号

版本号不再使用 1.x 了，而是 9.x.x 。

### 增加 jshell

jdk9 增加了新工具 jshell ，提供了一个交互式的命令行界面，可直接执行 java 语句和表达式等，类似于 node，直接解释执行不需要编译。可以编写脚本文件然后运行，脚本语法也做了精简，差不多相当于是编写 main 方法中的代码，但是可以在 main 方法中编写函数这种感觉，类似 js 。使用 /edit 命令可以调出图形化界面的编辑器来写脚本，但是调出来的编辑器也就是一个简单的文本框，没有语法高亮和代码补全功能，比较鸡肋。

### 增加了更多的诊断命令

为 jcmd 增加了更多的诊断命令，print_class_summary 等。

### 不再支持启动时指定版本

不再支持通过 manifest 配置或 -version 参数来指定 jre 版本启动，在实际开发中，几乎没有人会使用。

### 多版本 jar

支持一个 jar 包中的不同文件使用不同的 java 版本，可在 MANIFEST.MF 文件中定义。有些库为了支持多个 java 版本，往往需要发布多个不同衍生版本的 jar 包，现在只发布一个 jar 包就可以了，可以把多个不同 java 版本的代码写在一起，维护更方便了。

### 移除 hprof

移除 hprof 探针，但是保留格式，使用 jmap 或其它诊断工具仍然可以导出 hprof 格式。

### 移除 jhat

jhat 本来就是实验性功能，现在有很多更强大的内存观测和分析工具，所以 jhat 就没有必要了。

### 命令行参数校验

所有的数字参数都会被校验，防止崩溃。校验不通过的情况下，会以合适的方式展示错误。

```
java -XX:AllocatePrefetchStyle=5 -version
```

上面的命令，执行结果：

```
intx AllocatePrefetchStyle=5 is outside the allowed range [ 0 ... 3 ]   
Improperly specified VM option 'AllocatePrefetchStyle=5'   
Error: Could not create the Java Virtual Machine.  
Error: A fatal exception has occurred. Program will exit.
```

### 增强 javac 编译更早的版本

增加了 --release 参数，可替代 -source 和 -target，自动配置编译器来生成类文件，这些类文件将链接到给定平台版本的实现。当指定参数 -target 9 时，javac 会生成 53.0 版本的 class 文件。

### 支持 Datagram Transport Layer Security (DTLS)

JSSE（Java Secure Socket Extension） API 支持了 DTLS 1.0 和 1.2。

核心类 javax.net.ssl.SSLEngine 封装了 SSL/TLS/DTLS 。

![Flow of Data Through SSLEngine.jpg](/assets/blogs/2022/java-9-features/Flow of Data Through SSLEngine.jpg)

### 支持 TLS ALPN

扩展 javax.net.ssl package 支持 TLS Application Layer Protocol Negotiation (ALPN) Extension （应用层协议协商），使客户端和服务器可以在一个传输层端口上使用多个应用层协议。协议协商在握手阶段完成，不会增加网络的往返次数。

### OCSP Stapling

OCSP协议（Online Certificate Status Protocol 在线证书状态协议）用于管理证书的有效性和生命周期。Java 9 实现了 OCSP stapling，支持客户端和服务器两种模式，客户端驱动模式需要先配置启用。

![TLS Handshake with OCSP Stapling](/assets/blogs/2022/java-9-features/TLS Handshake with OCSP Stapling.jpg)

### 充分利用CPU 指令用于 GHASH 和 RSA

使用 HotSpot 内在函数 GHASH 将 AES/GCM/NoPadding 的性能提高 34 倍到 150 倍。GHASH 内部函数能被 intel x64 平台的 PCLMULQDQ 指令和 SPARC 平台的 xmul/xmulhi 指令提升速度。

SPARC 是 sun 公司研发的微处理器，目前 oracle 已经裁撤了相关部门，放弃了研发，没有再推出新版本，在 oracle 官网还可以查到看多相关资料。

### 提供 DRBG 实现

在 SecureRandom 中提供了 DRBG（Deterministic Random Bit Generator 确定性随机比特生成器）算法。

```java
SecureRandom sr = SecureRandom.getInstance("DRBG",
         DrbgParameters.instantiation(128, RESEED_ONLY, null));
```

### 禁用 SHA-1 证书

过提供更灵活的机制来禁用具有基于 SHA-1 的签名的 X.509 证书链，改进了 JDK 的安全配置。基于 SHA-1 数字签名算法存在碰撞攻击的风险。

### 默认创建 PKCS12 密钥库

将默认密钥库从 JKS 转换到 PKCS12，PKCS12 提升了安全性。

### 支持 SHA-3

java.security.MessageDigest 增加了以下的标准算法：SHA3-224, SHA3-256, SHA3-384, 和SHA3-512。

### 废弃 Java Plug-in 和 Applet API

Java plug-in 以及相关的 applet 技术在 9 中被废弃了，未来的版本中会被删除掉。

Applet是采用Java编程语言编写的小应用程序，在 html 中使用 <applet> 标签链接 applet 程序的 class 文件，如果浏览器支持就会下载相应的 class 文件并运行。html5 已经不支持 <applet> 标签，可使用 object 标签替代，部分浏览器仍然可以运行 applet。

```html
<applet code="game.class" align="left" archive="game.zip" height="250" width="350">
  <param name="difficulty" value="easy">
  <b>Sorry, you need Java to play this game.</b>
</applet>
```

我记得许多年前，上学的时候老师就说不用学 applet 了，工作之后使用过一两次 applet来做 web 打印。

### 简化 Doclet API

Doclet API 提供了一个环境，结合 Language Model API 和 Compiler Tree API ,客户端程序可以检查程序和库的源代码结构，包括源代码中的注释。这套 API 用于生成 html 格式的文档，支持用户自定义输出格式。

新版本对 API 做了简化，旧版本的 API 仍然被保留，可以继续使用。

### Javadoc 支持 html5

支持生成 html5 输出内容，只要注释中的 html 内容符合 html5 要求就可以生成在文档中。

### Javadoc 支持搜索

为生成的 api 文档提供一个搜索框，可在文档中查找程序元素、标记词和短语。

### 编译控制

提供控制 jvm 编译器的改进方法，可以在运行时进行管理，精度控制在方法上下文。可以在通过命令行启动程序时指定包含编译器指令的文件，还可以通过诊断命令在已经运行的程序中添加或删除指令。主要作用是用于排查编译器BUG。

### 统一JVM日志

为所有的JVM组件引入一个通用的日志系统。通过 -Xloggc 参数来控制所有的 jvm 组件产生的日志。

### 删除部分已经废弃的 GC 组合

移除JEP 173 中列出的极少使用的 GC 组合，大部分都是与 CMS 有关的，我自己从来不用的，这里就不再列出了。

### 默认回收器改为 G1

在jdk 8 中默认是 Parallel GC，但是可以通过参数设置为 g1，jdk 9 中将 G1 作为默认的回收器。G1 是为大内存的多处理器机器设计的，试图在延迟和呑吐量达到最佳平衡。

### 废弃 CMS 回收器

废弃了 CMS 回收器（Concurrent Mark Sweep Garbage Collector），CMS 回收器的大部分用途都可以使用 G1 来替代。

### 进程 API 更新

改善控制和管理操作系统进程的 API。由于现有的 API 限制太多，很多时候开发人员不得不使用原生代码，新版本做了改善，提供了原生进程ID、命令行参数、启动时间、CPU时间等信息，并且可以监控线程活跃度和销毁进程。

### 变量句柄 VarHandle

增加了 VarHandle ，提供了一系列标准方法用于对象成员变量和数组元素操作，与 java.util.concurrent.atomic 和 sun.misc.Unsafe 功能相同。

VarHandle 可用于操作对象成员变量，与反射功能相似，但是增加了自旋操作用于原子更新操作，数字类型还有累加方法。此外 VarHandle 还提供了一系列内存屏障操作来细粒度控制内存顺序。

下面是我写的 demo :

```java
public class Demo1 {

    public int count = 3;

    public static void main(String[] args) throws NoSuchFieldException, IllegalAccessException {
        VarHandle countHandle = MethodHandles
                .lookup()
                .in(Demo1.class)
                .findVarHandle(Demo1.class, "count", int.class);
        Demo1 instance = new Demo1();
        System.out.println(countHandle.get(instance));// 3
        // 将 count 设置为 5，设置的时候count的值必须是3，否则不设置
        countHandle.compareAndSet(instance, 3, 5);
        System.out.println(countHandle.get(instance));// 5
        // count 现在的值是 5，期望现在的值是 6 ，不会生效
        countHandle.compareAndSet(instance, 6, 7);
        System.out.println(countHandle.get(instance));// 仍然是 5
        // 累加
        countHandle.getAndAdd(instance, 1);
        System.out.println(countHandle.get(instance));// 6
    }
}
```

VarHandle 提供了原子操作，但是不需要同步操作，为并发编程提供了便利。

### 压缩字符串

为了提升空间的利用率，调整了字符串的表示法。新的表示法会根据字符串的内容，将字符串按照ISO-8859-1/Latin-1 (每个字符一个字节)或 UTF-16 (每个字符两个字节)编码进行存储，增加编码标记来识别使用的是什么编码。

### 平台日志服务

提供一个极小的日志API可以用来记录消息，同时也提供了服务接口，可以消费这些消息。可以很容易的与已经使用了外部日志的框架，如 SLF4j 和 Log4j等进行适配。新的日志可以处理启动问题，因此可以记录下在日志（日志服务接口）消费者初始化之前的信息。

### 更新并发功能

提供一个交互性强的订阅发布框架，增强 CompletableFuture 。增加了新的类 Flow 提供反应式流发布订单框架，Publisher 提供了实现类 SubmissionPublisher。CompletableFuture 支持设置超时时间。

### XML Catalogs

增加一个标准的 XML Catalog API，支持 OASIS XML Catalogs standard, v1.1。

### 方便的工厂方法创建集合

对 List、Set 和 Map 添加了新的工厂方法，用于快速创建一个不可修改的集合。

```java
Set<String> alphabet = Set.of("a", "b", "c");
```

### 增强 MethodHandle

支持循环和 try/finally 代码块的组合器，通过 MethodHandles.tryFinally 和 MethodHandles.loop 组合生成新的 MethodHandle，增强对参数的处理，MethodHandles.Lookup 中提供了接口方法、父构造器等查找实现。

### @Deprecated 注解增强

@Deprecated(forRemoval=true) 表示 API 未来会被删除，@Deprecated(since="version") 表示从哪个版本开始废除。

### 循环等待提示 Spin-Wait Hints

通过 Thread.onSpinWait 可以提示调用者当前处于循环等待中，暂时无法继续进行，直到条件成立，它允许 JVM 在某些系统架构上发出处理器指令，以改善此类自旋等待循环中的反应时间，减少核心线程的功耗。

```java
class EventHandler {
    volatile boolean eventNotificationNotReceived;

    void waitForEventAndHandleIt() {
        while (eventNotificationNotReceived) {
            java.lang.Thread.onSpinWait();
        }
        readAndProcessEvent();
    }

    void readAndProcessEvent() {
        // Read event from some source and process it            . . .       
    }
}
```

### Stack-Walking API

Stack-Walking API 提供了过滤和推迟访问堆栈跟踪信息的能力。

```java
// 查找最上层调用者的class
StackWalker walker = StackWalker.getInstance(StackWalker.Option.RETAIN_CLASS_REFERENCE);
final Optional<? extends Class<?>> callerClass = walker.walk(
        s -> s.map(StackWalker.StackFrame::getDeclaringClass)
                .findFirst()
);
callerClass.ifPresent(System.out::println);
```

### Nashorn 引擎

java 自带的 js 引擎 Nashorn 实现了部分 es6 特性。这里就不过多关注了，Nashorn 在后面的版本中被删除了，工作中也从来不用的。

### 客户端技术

下面是客户端相关技术的更新内容：

- 多分辨率图片，适配显示设备运行时的 dpi 变化
- 为 JavaFX UI 控件和 CSS 功能提供公共 API
- 提供TIFF（Image File Format）读写功能
- 自动拉伸和缩放组件，适应 windows 和 linux 的 HiDPI
- 为 java.awt.Desktop 增加方法支持与桌面互动，比如设置默认 menu bar 等
- 支持 GTK 3

JavaFx 在后面的版本从 Jdk 中移除了，需要单独下载，这里简单了解下，使用 Java 做桌面应用的还是比较少的。

### 国际化

- 支持 unicode 8
- 在JDK 9中，默认的语言环境数据使用来自 CLDR (Unicode Consortium's Common Locale Data Repository）的数据。本地化语言显示可能与 jdk8 有所不同，部分时区没有专门的本地化显示名称
- 默认使用 utf8 编码加载 properties 文件

### 允许在私有方法上使用注解 @SafeVarargs

@SafeVarargs 可以用在不能被覆写的方法上，静态方法和 final 修饰的方法，现在可以在 private 修饰的（final）方法上使用了。

在声明具有模糊类型的可变参数的构造函数或方法时，Java编译器会报unchecked警告，使用 @SafeVarargs 可以压制，相当于告诉编译器：断定方法或构造器中不会对可变参数做不安全的操作

### 下划线不再是一个合法的名称

下线不能再作为一个标识符，如果代码中有使用下划线作为名称，将不能被编译。

![下划线不再是一个合法的名称](/assets/blogs/2022/java-9-features/idea中的下划线提示.jpg)

### 允许钻石语法和匿名内部类一起使用

在 9 中，只要被推断的类型是确定的，那么就可以使用钻石语法在匿名内部类上。下面是我写的 demo，在版本 9 及以上是可以运行的，在 8 及之前的版本不能运行。

```java
Function<String, Integer> f = new Function<>() {
  // 9 中类型可以推断出来，可以使用钻石语法省略类型
    @Override
    public Integer apply(final String s) {
        return Integer.parseInt(s);
    }
}
```

在 8 中得写成这样：

```java
Function<String, Integer> f = new Function<String,Integer>() {// 8 中这里必须写类型
            @Override
            public Integer apply(final String s) {
                return Integer.parseInt(s);
            }
        };
```

当然，如果是函数式接口的匿名实现类，可以使用 lambda 更简洁。上面的例子仅仅是为了说明新语法。

### 接口支持私有方法

现在可以在接口上可以添加私有方法了。

```java
public class InterfaceTest {
    private void sayHello(String name) {
        System.out.println("hello " + name);
    }
}
```

### 正则表达式修正否定函数

正则的否定不是第一个范围了，而是整个层级。比如原本 [^a-b[c-d]] 是可以匹配 c ，因为 [c-d]没有被否定，^ 只否定了第一个范围，新版本就不可以了。

### 网络

FTP 链接默认超时时间改为5分钟，原来是无限制的。默认不支持 TLS ，需要用户自己设置额外的密钥。