java 11 引入了新的回收器，删除和废弃了大量的 api。

### Unicode 10

升级已有的平台 API 支持 Unicode10.0 版本。

### HTTP 客户端

之前 JDK9 中引入了孵化的 HTTP client ，JDK10 中做了更新，JDK11 中做了标准化。之前包 jdk.incubator.http 下的 API 被移除，有依赖的代码，现在需要改为使用包 java.net.http 。

```java
// 异步请求示例代码
HttpClient client = HttpClient.newBuilder()
  .version(HttpClient.Version.HTTP_1_1)
  .followRedirects(HttpClient.Redirect.NORMAL)
  .connectTimeout(Duration.ofSeconds(20))
  .proxy(ProxySelector.of(new InetSocketAddress("proxy.example.com", 80)))
  .authenticator(Authenticator.getDefault())
  .build
HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("https://foo.com/"))
  .timeout(Duration.ofMinutes(2))
  .header("Content-Type", "application/json")
  .POST(HttpRequest.BodyPublishers.ofFile(Paths.get("file.json")))
  .build();
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
  .thenApply(HttpResponse::body)
  .thenAccept(System.out::println);
```

### Collection 新增加了 toArray(IntFunction) 的默认方法

使用 toArray() 创建的数组返回的类型是 Object[], 使用 toArray(T[]) 又必须复用一个已经存在的数组，新方法 toArray(IntFunction) 提供了方便，你可以像下面这样使用：

```java
Collection<String> list = new ArrayList<>();
 list.add("A");
 list.add("B");
 final String[] arr = list.toArray(String[]::new);
```

### 更新 CLDR 到 v33 版本

从 jdk9 开始，就默认使用 CLDR（Unicode Consortium's Common Locale Data Repository）作为默认本地化数据，这一次版本升级到了 v33。在很多平台上，CLDR 已经是事实上的本地化标准。

CLDR 是一个公共的数据库，里面存储了各个国家和地区的相关缩写及日期等各种本地化名称信息。

### 延迟分配编译线程

新增加一个命令行参数 -XX:+UseDynamicNumberOfCompilerThreads 用于动态控制编译线程。不管可用的 cpu 和内存资源有多少，虚拟机总是会在系统中启动许多编译线程，甚至这些线程都是闲置的，这样导致用户资源的使用效率低下。新版本改为在虚拟机启动时只为每种类型启动一个编译线程，动态的启动和关闭更多的线程，通过 -XX:+UseDynamicNumberOfCompilerThreads 来控制， 默认是开启的。

### ZGC

ZGC 是一个低延迟可伸缩的回收器。ZGC 的目标：暂停时间不超过 10 毫秒，暂停时间不会随着堆的大小增加而增加，能处理几百兆到几 TB 的堆。

ZGC 在 jdk11 中只是一个实验性功能，需要通过参数 -XX:+UnlockExperimentalVMOptions 和 -XX:+UseZGC 来开启。

### Epsilon

Epsilon GC 是一个新的实验性质的无操作回收器。Epsilon GC 只处理内存的分配，没有回收机制，可用于性能测试，适用于短暂的任务。

### 低开销的堆分析

提供一种对 Java 堆分配进行采样的低开销方式，可通过 JVMTI 访问。

### 嵌套访问控制

引入了巢（nest）的概念来解决之前内部类源码与编译结果访问控制权限不一致问题。由于内部类会被编译成单独的类文件，这样嵌套的内部类和其宿主类相互访问私有方法就很很麻烦了，因为编译后成了两个独立的类，私有属性不能被别的类访问。在之前是通过在编译器生成桥接方法来实现的，在两个类文件中生成一些静态方法，访问权限是包，通过这些静态方法间接访问内部属性。但是这样导致了一些问题，实际上相互访问私有属性仍然是不允许的，只是桥接方法变通维持了程序逻辑，如果使用反射来调用就会出现访问权限问题。所以，新版本引入了巢的概念，根据巢的关系来验证访问权限，不再生成桥接方法。同时也添加了巢相关的 API：java.lang.Class:getNestHost,getNestMembers, 和 isNestmateOf。

### Curve25519 和 Curve448 钥协商协议

添加了使用 Curve25519 和 Curve448 实现的新密钥协商方案。

### 增强的 KeyStore 机制

引入了新的安全属性 jceks.key.serialFilter ，如果这个过滤器被配置了，JCEKS KeyStore 在加密密钥对象反序列化时就会使用它。

### ChaCha20 和 Poly1305 密码算法

实现 RFC 7539 中定义的 ChaCha20 和 ChaCha20-Poly1305 密码器，ChaCha20 新的流式密码品，用于替换旧版本。

### SunMSCAPI 增加了对 RSASSA-PSS 签名的支持

RSASSA-PSS 是新的签名算法，被 TLS 1.3 强制要求。SunMSCAPI 使应用程序能够使用标准 JCA/JCE API （Java Cryptography Architecture/Java Cryptography Extension）来访问 Windows 平台上的本地加密库、证书存储和密钥容器，此次增加了对 RSASSA-PSS 的支持。

### TLS 1.3

JDK 11 版本包括了传输层安全性 (TLS) 1.3 规范 (RFC 8446) 的实现。

### 允许 lambda 表达式的形参使用 var

lambda 表达式的形参也可以使用使用 var 了。

```java
(var x, var y) -> x.process(y)
```

上面的代码相当于：

```java
(x, y) -> x.process(y)
```

这个特性实际用处不大，只是为了 lambda 语法上和别处保持一致，可以统一都使用 var。

### 直接启动源码单文件

单文件程序或者脚本启动更方便了，可以直接使用 java 命令启动程序：

```
 java HelloWorld.java
```

### 删除 Thread.destroy() 和 Thread.stop(Throwable) 方法

这两个方法之前的版本早就废弃了，这一次直接删除，如果代码有依赖，编译就会报错。destroy() 方法实际上一直是没有实现的，后来也废弃了。

```java
@Deprecated
public void destroy() {
    throw new NoSuchMethodError();
}
```

stop() 方法是天然不安全的，使用 stop 方法停止线程会释放线程持有的所有的锁，这会导致锁所保护的对象数据不一致，产生奇怪的程序错误，因为锁本身就是为了保护数据一致性，不符合预期。

```java
Thread t = new Thread() {
    @Override
    public synchronized void run() {
       System.out.println("111");
       try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            System.out.println("线程被打断");
        }
        System.out.println("222");
    }
};
t.start();
Thread.sleep(500);
t.stop();
```

上面的代码在 jdk8 下运行，只输入了 111，run() 方法加锁了，但是锁中的内容只执行了一部分，其它加锁的情况也是一样。程序没有退出的情况下，锁保护的程序只执行了一部分，那么程序处理的数据很可能会发生错误，不符合预期。这是我对为什么废弃 stop 的理解，stop 这个方法的源码注释中也有说明。

### 删除 JavaFX

JavaFX 模块在 11 版本中被移除了，之前是一直包含在 jdk 中的。JavaFX 现在作为一个独立项目存在，可单独下载使用，官网：[https://openjfx.io/](https://openjfx.io/) 。

### 除自带的 Java EE 和 CORBA 模块

从 Java SE 和 JDK 中删除 Java EE 和 CORBA 相关模块，这些模块在 Java SE 9 中就废弃了。之所以这么处理是为了更方便的管理，Java EE 发展的很快，但是部分技术是包含在 Java SE 中的，迭代版本就很麻烦。

删除的 Java EE 的相关技术：

- JAX-WS，Java API for XML-Based Web Services
- JAXB，Java Architecture for XML Binding
- JAF，the JavaBeans Activation Framework
- Common Annotations

CORBA（Common ObjectRequest Broker Architecture 公共对象请求代理体系结构）是由 OMG 组织制订的一种标准的面向对象应用程序体系规范。Java 1.4 就支持了 CORBA，这项技术主要用到分布式系统通讯访问数据，由于过于复杂，并没有能流行起来，用的人很少，目前的主流是 rest api。

### 其它被删除的功能特性

- 删除类 com.sun.awt.AWTUtilities。
- 删除 Lucida 字体，jdk 不再提供任字体，完全依赖操作系统安装的字体。
- 删除 appletviewer Launcher
- Oracle JDK 中的 javax.imageio JPEG 插件不再支持有 alpha 通道的图片
- 删除 sun.misc.Unsafe.defineClass
- 删除 sun.nio.ch.disableSystemWideOverlappingFileLockCheck 属性
- 删除 sun.locale.formatasdefault 属性
- 删除 JVM-MANAGEMENT-MIB.mib ，这个本来是一个用于 jvm 监控的 SNMP （简单网络管理协议）规范，使用 jmx 替代它
- 删除 SNMP 探针
- 删除 java 部署相关技术，包含 java 插件和 Java WebStart
- 删除 JMC，不再绑定到 jdk 中，可下载独立版本

### 被废弃的一些功能特性

- ThreadPoolExecutor 的 finalize()不能再被用来关闭线程池，不要依赖它
- 废弃 NSWindowStyleMaskTexturedBackground，awt 中的功能。虽然 Java FX 移除了，但是 awt 和 swing 仍然保留了在模块 java.desktop 中
- 废弃 JavaScript 引擎 Nashorn
- 废弃参数 -XX:+AggressiveOpts，该选项最初应该启用 C2 编译器的实验性优化，以提高特定基准测试的性
- 参数-XX:+UnlockCommercialFeatures 和-XX:+LogCommercialFeatures 废弃，使用后启动会有警告
- 废弃 GSSContext 中基于流的方法
- Pack200 工具和相关 API 废弃，pack200 是一个用于压缩 jar 包的工具
