### 支持 Unicode 14.0

java.lang.Character 支持了 unicode 14.0 , unicode 新增了 838 个字符, 目前一共 144697 个字符.

下面是示例代码,演示使用新增的 emoji 表情字符:

```java
 // 人戴皇冠表情字符 unicode 编码: 1FAC5
// 由于这个字符是超过16位的,需要使用代理(surrogate)转换成两个16位单元
// 1FAC5 转换后是 D83E + DEC5
String 	personWithCrown = "\uD83E\uDEC5";
System.out.println(personWithCrown);
```

unicode 代理(Surrogate)转换, 可使用这个在线工具: [The Surrogate Pair Calculator](http://www.russellcottrell.com/greek/utilities/SurrogatePairCalculator.htm)

### 新增系统属性 stdout.encoding 和 stderr.encoding

新增系统属性 stdout.encoding 和 stderr.encoding 来设置 System.out 和 System.err 的编码. 默认是依赖于平台的,
但是当平台没有提供控制台的流时,将从系统属性 native.encoding 取值. 比如你更改了 System.out :

```java
System.setOut(new PrintStream(new FileOutputStream("out.txt")));
System.out.println("输入到文件");
```

但是 native.encoding 并不是正式的特性,没有在官方文档中说明,这些的更新提供了正式的系统属性设置项 stdout.encoding 和 stderr.encoding 来设置编码.

### 引入更多的日期时间格式

java.time.format.DateTimeFormatter/DateTimeFormatterBuilder 添加了新方法,
允许额外定义本地化日期的格式.

```java
// 之前的版本 只能使用 FormatStyle 定义好的 4 种格式
DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL);
LocalDateTime now = LocalDateTime.now();
System.out.println(now.format(formatter));// 2023年2月1日星期三
// 新版本使用 ofLocalizedPattern 自定义本地化日期格式
// 这个方法有很多限制, 格式要求和当前的语言环境有关, 测试环境是 zh-CN
DateTimeFormatter customFormat = DateTimeFormatter.ofLocalizedPattern("yyyyMMd");
System.out.println(now.format(customFormat));// 公元 2023/2/1
```

### 创建预分配 HashMap 和 HashSet 的新方法

新增加了几个方法可以方便的创建 HashMap 和 HashSet。

- HashMap.newHashMap
- LinkedHashMap.newLinkedHashMap
- WeakHashMap.newWeakHashMap
- HashSet.newHashSet
- LinkedHashSet.newLinkedHashSet

上面这些新增的方法都有一个参数，可以指定初始容量，和直接调用构造器是一样的。

```java
HashMap<Object, Object> hashMap = HashMap.newHashMap(2);
hashMap.put("A",1);
hashMap.put("B",2);
System.out.println(hashMap.get("A"));
```

### 在 Linux/AArch64 上支持 PAC-RET 保护

在 arm64 平台的 linux 系统上支持 PAC-RET 保护，利用硬件特性防 ROP （Return Orientated Programming）攻击。

要使用这个特性，JDK 必须使用 GCC 9.1.0+ 或 LLVM 10+ 来构建，并使用选项 --enable-branch-protection。
在启动 jvm 时还要添加参数 -XX:UseBranchProtection=standard 才可以。

#### 关于 PAC

2016年10月，ARMV8.3-A指令集中加入了指针认证（Pointer Authentication）机制，在使用寄存器的值作为指针访问数据或代码之前验证其内容，目的是为了对抗ROP/JOP攻击。

详细信息：[Pointer Authentication and Branch Target Identification Extension](https://community.arm.com/arm-community-blogs/b/architectures-and-processors-blog/posts/armv8-1-m-pointer-authentication-and-branch-target-identification-extension)

#### 关于 AArch64 和 arm64

> ‘arm64’ is the Debian port name for the 64-bit ARMv8 architecture, referred to as ‘aarch64’ in upstream toolchains (GNU triplet aarch64-linux-gnu), and some other distros. 

### 自动生成 CDS 归档文件

新的 JVM 选项 -XX:+AutoCreateSharedArchive 可用于自动生成或更新 CDS（Class Data Sharing） 归档文件。

```
java -XX:+AutoCreateSharedArchive -XX:SharedArchiveFile=app.jsa -cp app.jar App
```

上面的命令，如果归档文件不存在，就会写文件，如果已经存在则会使用。

#### CDS

CDS（Class data sharing）可以帮助多个 JVM 进程节省启动时间和内存占用。CDS 归档文件做好内存映射的，JVM 启动时读取 CDS
文件相比重新加载一次类信息要快很多。

### TLS 签名模式 （Signature Schemes）

SSLParameters 增加了 getSignatureSchemes() 和 setSignatureSchemes() 方法用于获取和设置签名模式。

完示例代码：

```java
SocketFactory socketFactory = SSLSocketFactory.getDefault();
Socket socket = socketFactory.createSocket("www.baidu.com", 443);
SSLSocket sslSocket = (SSLSocket) socket;

// 自定义 签名模式
SSLParameters sslParameters = sslSocket.getSSLParameters();
// getSignatureSchemes 获取当前默认签名模式, 默认返回 null
sslParameters.getSignatureSchemes();
sslParameters.setProtocols(new String[]{"TLSv1.2"});
// 自定义模式列表, 程序会将自定义的顺序作为优先级顺序
sslParameters.setSignatureSchemes(new String[]{
        "rsa_pkcs1_sha256", "rsa_pss_rsae_sha256", "rsa_pss_pss_sha256"
});
sslSocket.setSSLParameters(sslParameters);

sslSocket.startHandshake();
PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(socket.getOutputStream())));

out.println("GET / HTTP/1.1");
out.println("Accept: text/html");
out.println();
out.flush();

if (out.checkError()) {
    throw new RuntimeException("SSLSocketClient:  java.io.PrintWriter error");
}

/* 读取响应信息 */
BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

String inputLine;
while ((inputLine = in.readLine()) != null) System.out.println(inputLine);

in.close();
out.close();
socket.close();
```

附签名模式列表：

- ecdsa_secp256r1_sha256
- ecdsa_secp384r1_sha384
- ecdsa_secp521r1_sha512
- ecdsa_sha1
- ed25519
- ed448
- rsa_pkcs1_sha1
- rsa_pkcs1_sha256
- rsa_pkcs1_sha384
- rsa_pkcs1_sha512
- rsa_pss_pss_sha256
- rsa_pss_pss_sha384
- rsa_pss_pss_sha512
- rsa_pss_rsae_sha256
- rsa_pss_rsae_sha384
- rsa_pss_rsae_sha512

### 虚拟线程（预览）

引入虚拟线程，虚拟线程是轻量级线程，可以大大减少编写、维护和观察高吞吐量并发应用程序的工作量。目前是预览版本。

传统的服务器请求处理模式。Java 中的线程模型与操作系统是 1:1 对应的，创建和切换线程代价很大，受限于操作系统，只能创建有限的数量。
当并发量很大时，无法为每个请求都创建一个线程。使用线程池可以缓解问题，线程池减少了线程创建的消耗，但是也无法提升线程的数量。
假如并发量是200，线程池只有100个线程，那么同一时刻只能处理100个请求，还有100个请求是无法处理的，可以拒绝掉，也可以使其等待，直到有线程让出。

现在已经有很多框架实现了异步风格的并发编程，通过线程共享来实现更高的可用性。原理是通过线程共享减少了线程的切换，降低了消耗，
同时也避免阻塞，只在程序执行时使用线程，当程序需要等待时则不占用线程。

异步风格确实有不少提升，但是也多缺点。大部分异步框架都使用链式写法，将程序分为很多个步骤，每个步骤可能会在不同的线程中执行，你不能再使用熟悉的 ThreadLocal 等并发编程相关的 api，否则可能会有错误。编程风格上也有很大的变化，比传统模式的编程风格要复杂很多，学习成本高不说，可能还要改造项目中的很多已有模块使其适配异步模式。我个人是很喜欢 Java 的一些响应式框架的异步风格，相比同步写法，是真的繁琐。

kotlin 自带协程，对异步编程提供了语法级支持，开发效率上提升了不少。但是 jvm 中并没有协程，通过监控工具也无法查看到相关信息。

虚拟线程可以使得你保持传统的编程风格，也就是一个请求一个线程的模式，像使用线程一样使用虚拟线程，程序只需要做很少的改动。

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
}  // executor.close() is called implicitly, and waits
```

上面是一段虚拟线程的代码，可以看到，仅仅是创建线程执行器调用了不同的 api，代码一模一样，但是实际上使用的是虚拟线程。虚拟线程也没有引入新的语法，可以说学习和迁移成本极低。

虚拟线程的原理和一些异步框架差不多，也是线程共享，当然也就不需要池化。在使用时你可以认为虚拟线程是无限充裕的，你想创建多少就创建多少，不必担心会有问题。不仅如此，虚拟线程支持 debug，并且能被 Java 相关的监控工具所支持，这很重要。

#### 关于预览(preview)和孵化(incubator)的区别

preview 官方说明:

> A preview language or VM feature is a new feature of the Java SE Platform that is fully specified, fully implemented, and yet impermanent. It is available in a JDK feature release to provoke developer feedback based on real world use.

incubator module 官方说明:

> Incubator modules are a means of putting non-final APIs and non-final tools in the hands of developers, while the APIs/tools progress towards either finalization or removal in a future release.

incubator 模块是还没有定稿的 API，将来有可能会被删除掉，最好不要使用。preview 则是已经有完整的规范，也有完整的实现，但并不是永久的。
preview 是放出来给开发人员使用，用来收集真实使用中的反馈。preview 版本的功能一般是可以用的，不太会在未来的版本中被删除。
