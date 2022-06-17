### 添加三个 FileSystems.newFileSystem 重载方法

java.nio.file.FileSystems 添加了三个新方法，使可以更方便的使用 FileSystem.

- newFileSystem(Path)
- newFileSystem(Path, Map<String, ?>)
- newFileSystem(Path, Map<String, ?>, ClassLoader) 

### java.nio.ByteBuffer 新增加批量的 get/put 方法

新增加方法 get(byte[] dst) 方法可将 ByteBuffer 的内容传输到指定的数组中，方法 put(byte[] src) 用于将指定字节数组中的内容全部传输到 ByteBuffer 中。

### 支持 Unicode 12.1

下面的相关 API 做了对 unicode 12.1 版本的支持：

- java.lang.Character 
- java.text.Bidi 和 java.text.Normalizer 
- 包 java.util.regex

### ZGC 归还无用内存

在之前的 jdk12 中已经做了对归还无用内存的增强。新增参数 -XX:ZUncommitDelay=<seconds>（默认300秒）用于指定内存有多长时间未使用才能被归还。

### 新增 -XXSoftMaxHeapSize 参数

添加了新的命令行参数 -XX:SoftMaxHeapSize=<bytes>，只对 ZGC 有用。如果设置了这个参数，回收器将努力不让增长的内存超出设定值，除非是为了不让内存溢出必须要增长更多的内存。这个参数可以在运行时设置，可以通过 HotSpot MXBean 或 jcmd 来更改。

### ZGC 最大堆大小增加到 16TB

ZGC 支持的最大内存从 4TB 提升到了 16TB。

### 动态 CDS 归档

扩展 AppCDS（application class-data sharing 应用类数据共享），允许在程序退出时动态存档类数据（class-data）。
JDK 5 中引入了 CDS （Class-Data Sharing）技术，允许把一组类预处理为共享归档文件，在启动时可以被直接映射到内存，从而减少启动时间。当有多个 JVM 进程共享相同的文件时，也可以减少动态内存占用。但是 CDS 只允许 bootstrap 类加载器加载存档文件，AppCDS 扩展了 CDS，允许内建的类加载器和用户自定义的类加载器加载存档文件。动态 CDS 归档（Dynamic CDS Archives）对 AppCDS  又进行了扩展，允许在程序结束时动态的存档类信息。

动态 CDS 归档相比 AppCDS 简化了流程，提升了易用性，AppCDS 需要有三个步骤：

1. 执行一到多次的试运行，来创建 class 列表
2. 通过创建的 class 列表来导出归档文件
3. 使用归档文件运行程序

```bash
# 创建 class 列表
java -Xshare:off -XX:+UseAppCDS -XX:DumpLoadedClassList=hello.lst -cp hello.jar HelloWorld
# 使用创建的 class 列表导出归档文件
java -Xshare:dump -XX:+UseAppCDS -XX:SharedClassListFile=hello.lst \
    -XX:SharedArchiveFile=hello.jsa -cp hello.jar
# 使用归档文件来运行程序
java -Xshare:on -XX:+UseAppCDS -XX:SharedArchiveFile=hello.jsa \
    -cp hello.jar HelloWorld
```

而动态 CDS 归档相较而言则省略了第一个步骤，可以设置在程序退出时自动生成归档文件，下次使用归档文件来运行程序。

```bash
# 设置程序在退出时生成归档文件
java -XX:ArchiveClassesAtExit=hello.jsa -cp hello.jar Hello
# 使用归档文件来运行程序
java -XX:SharedArchiveFile=hello.jsa -cp hello.jar Hello
```

### CRL 超时时间可配置

通过系统属性 com.sun.security.crl.readtimeout 可以设置 CRL （Certificate Revocation List）检索的最大时间，单位秒，未设置默认15秒。

### 新的命令 keytool -showinfo -tls 用于显示 TLS 配置信息

添加了新命令 keytool -showinfo -tls 用于显示 TLS 配置。

```
$ keytool -showinfo -tls

Enabled Protocols
-----------------
TLSv1.3
TLSv1.2

Enabled Cipher Suites
---------------------
TLS_AES_256_GCM_SHA384
TLS_AES_128_GCM_SHA256
TLS_CHACHA20_POLY1305_SHA256
....
```

### 支持 windows 系统 CNG

SunMSCAPI 支持了从 CNG （Cryptography Next Generation）格式中读取私钥。SunMSCAPI 是一种可通过 JCA/JCE 接口直接使用 windows 系统密钥库的技术，前面整理 java 11 更新内容时有介绍过。这个功能是不能跨平台的，一般的程序开发很少用。

### SunPKCS11 支持 PKCS#11 v2.40

SunPKCS11 做了更新，支持了 PKCS#11 v2.40，这个版本支持了更多的算法。

### 在 TLS 中支持 X25519 和 X448

x25519 和 x448 现在可用于 TLS 版本 1.0 到 1.3 中的 JSSE 密钥协商。

### JSSE 无服务器状态恢复会话

该特性允许 JSSE 的服务器端无状态运行，TLS 服务器以加密会话ticket的形式向支持无状态的客户端发送内部会话信息，该会话ticket在 TLS 握手期间提供给服务器以恢复会话。这应该会提升 TLS 服务器在高负载下的性能和内存使用率，因为会话缓存很少使用。

### 允许限制 SASL 机制

通过安全属性 jdk.sasl.disabledMechanisms 可以禁用 SASL 机制。 SASL全称Simple Authentication and Security Layer，是一种用来扩充C/S模式验证能力的机制。这个机制其实很弱，所以支持限制使用能更方便些。

### XML 1.1 URI 添加新字符串常量

新的常量 INCLUSIVE_11 和 INCLUSIVE_11_WITH_COMMENTS添加到了javax.xml.crypto.dsig.CanonicalizationMethod 中。

```java
/**
  * The <a href="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">Canonical
  * XML (without comments)</a> canonicalization method algorithm URI.
  */
static final String INCLUSIVE =
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";

/**
  * The
  * <a href="http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments">
  * Canonical XML with comments</a> canonicalization method algorithm URI.
  */
static final String INCLUSIVE_WITH_COMMENTS =
        "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments";
```

### xmldsig 添加了 KeyValueEC 类型

支持了 [W3C Recommendation for XML-Signature Syntax and Processing](https://www.w3.org/TR/xmldsig-core/#sec-ECKeyValue) 中的 ECKeyValue 类型，接口 javax.xml.crypto.dsig.keyinfo.KeyValue 中添加了常量 EC_TYPE。

```java
/**
 * URI identifying the EC KeyValue KeyInfo type:
 * http://www.w3.org/2009/xmldsig11#ECKeyValue. This can be specified as
 * the value of the <code>type</code> parameter of the
 * {@link RetrievalMethod} class to describe a remote
 * <code>ECKeyValue</code> structure.
 */
static final String EC_TYPE = "http://www.w3.org/2009/xmldsig11#ECKeyValue";
```

EC（Elliptic Curve） 公钥 xml 数字签名语法示例：

```xml
<ECKeyValue xmlns="http://www.w3.org/2009/xmldsig11#">
  <NamedCurve URI="urn:oid:1.2.840.10045.3.1.7" />
  <PublicKey>
    vWccUP6Jp3pcaMCGIcAh3YOev4gaa2ukOANC7Ufg
    Cf8KDO7AtTOsGJK7/TA8IC3vZoCy9I5oPjRhyTBulBnj7Y
  </PublicKey>
</ECKeyValue>
```

### windows 平台上添加一个默认的本地 GSS-API 库

windows 版本的 jdk 添加了一个本地的 GSS-API 库，该库仅仅是客户端，并使用默认凭据。将系统属性 sun.security.jgss.native 设置为 true ，将会加载该库，也可以通过 sun.security.jgss.lib 来加载第三方本地库。

GSS-API 是一个以通用方式为调用方提供安全服务的框架。许多底层机制和技术（如 Kerberos v5 或公钥技术）都支持 GSS-API 框架。

GSS-API 参考资料:

- [Generic Security Service Application Program Interface](ftp://ftp.isi.edu/in-notes/rfc2743.txt)
- [Generic Security Service API Version 2: C-Bindings](ftp://ftp.isi.edu/in-notes/rfc2744.txt)

### 支持 Kerberos Cross-Realm Referrals (RFC 6806)

Kerberos 客户端增强，支持主体名称规范化和跨域引用（Principal Name Canonicalization and Cross-Realm Referrals），详细可查看 RFC 6806。

### switch 表达式增强

之前 jdk 12 中 引入了 case ... -> 语法，可在 case 后跟上表达式，不会出现下落的情况，不需要写 break。现在不管表达式还是语句都可以支持了，方便了不少。

```java
switch (flag) {
   case 1 -> System.out.println("1");
   // 表达式
   case 3 -> System.out.println("1");
   case 4 -> {
　　　// 语句
      String str = "4";
      System.out.println(str);
   }
}
```

新特性也是为未来在 switch 中支持模式匹配做准备，模式匹配示例：

```java
static String formatterPatternSwitch(Object o) {
    return switch (o) {
        case Integer i -> String.format("int %d", i);
        case Long l    -> String.format("long %d", l);
        case Double d  -> String.format("double %f", d);
        case String s  -> String.format("String %s", s);
        default        -> o.toString();
    };
}
```

当然，模式匹配目前为止还没有支持，我使用的 jdk17 仍然不能使用这个语法。

### 文本块

支持多行字符串字面量，不需要拼接和写各种转义，可读性更好。

之前版本拼接字符串：

```java
String html = "<html>\n" +
              "    <body>\n" +
              "        <p>Hello, world</p>\n" +
              "    </body>\n" +
              "</html>\n";
```

使用文本块：

```java
String html = """
              <html>
                  <body>
                      <p>Hello, world</p>
                  </body>
              </html>
              """;
```

新语法确实方便了不少，但是没有支持插件表达式，如果能像 es6 的模板字符串一样就好了。在官方的文档中，对于这种动态拼接的需求，给的方案是使用字符串自带的替换或格式化。

```java
String code = """
              public void print($type o) {
                  System.out.println(Objects.toString(o));
              }
              """.replace("$type", type);
String source = """
                public void print(%s object) {
                    System.out.println(Objects.toString(object));
                }
                """.formatted(type);
```

### 新增创建支持命名空间的 DOM 和 SAX 工厂的方法

新增加了三个方法：

- newDefaultNSInstance()
- newNSInstance()
- newNSInstance(String factoryClassName, ClassLoader classLoader) 

使用上面这几个方法，通过工厂创建的解析器是默认支持命名空间的。

```java
DocumentBuilder db = DocumentBuilderFactory.newDefaultNSInstance().newDocumentBuilder();
```

相当于：

```java
DocumentBuilderFactory dbf = DocumentBuilderFactory.newDefaultInstance(); 
dbf.setNamespaceAware(true); 
DocumentBuilder db = dbf.newDocumentBuilder();
```

### javadoc 删除一些旧的特性

不再支持使用 html4 生成 api 文档，jdk9 开始就支持了 html5，生成 api 文档时要保证使用的 html 标签必须能完全符合 html5。

不再支持一些老的 javadoc API，包含 com.sun.javadoc , 旧的文档部件 (com.sun.tools.doclets.standard), 和旧的入口 (com.sun.tools.javadoc.Start)等。 

不再支持使用 HTML frame 来生成文档。

不再支持 --no-module-directories，此选项为 JDK 9 和 10 中的 javadoc 工具用于限制生成文档的目录结构，其中不同模块的文件未分组到单独的目录中

### 其它被删除的功能特性

- 删除系统属性 awt.toolkit
- java.lang.Runtime 中删除traceInstructions(boolean)和traceMethodCalls(boolean) 两个方法，相关的功能可使用 JVMTI
- 早于 jdk 1.4 版本的SocketImpl实现类被移除
- 删除命令行参数 -XX+AggressiveOpts
- SunJSSE 中删除了对RSA KeyFactory,RSA KeyPairGenerator,MD2withRSA,MD5withRSA, 和SHA1withRSA Signature的支持 
- 证书 T-Systems Deutsche Telekom Root CA 2 已经过时了，被从 cacerts 密钥库中删除
- 删除两个 DocuSign 根证书：certplusclass2primaryca、certplusclass3pprimaryca
- 删除两个Comodo根证书：utnuserfirstclientauthemailca、utnuserfirsthardwareca
- 内部包 com.sun.net.ssl 被删除
- 实验性的 FIPS 140 兼容模式已从 SunJSSE 中删除

### 被废弃的功能特性

- 废弃并不再支持 mac os 平台上 swing 的 Motif Look and Feel，相关源码已经删除，使用 javax.swing.plaf.metal.MetalLookAndFeel 来替代 
- 废弃 rmic，标记将来会被删除。rmic 工具用于创建支持 Java 远程方法调用 (RMI) 工具使用的 Java 远程方法协议 (JRMP) 的静态存根。
- 废弃java 命令行参数 -Xverifynone 和 -noverify
- javax.security.cert api 被废弃