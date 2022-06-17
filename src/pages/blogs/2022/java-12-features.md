### 支持 Unicode 11

新增加 684 个字符，11 个块，7 个脚本。unicode 目前最新版本是 14.0 ，java 已经于 15 版本中支持到了 13。

### 在 linux 系统上支持 POSIX_SPAWN

可通过将系统属性 jdk.lang.Process.launchMechanismproperty 设置为 POSIX_SPAWN 在 linux 系统上使用 posix_spawn 创建子进程，默认是 vfork 。

### JVM 常量 API

引入新的 API 来对字节码文件和运行时工件的名义描述（nominal descriptions）进行建模，特别是可从（字码码文件）常量池加载的常量。

每一个字节码文件都有一个常量池，用来存储字节码指令的操作数。常量池中的条目要么描述类和方法等运行时工件，要么描述字符串和整数等简单值。这些条目被称为可加载常量，因为它们可以作为“ldc”指令的操作数。

新增加的类：ConstantDesc、ClassDesc,MethodTypeDesc,MethodHandleDesc, 和DynamicConstantDesc 。这套 API 的添加旨在提供一个标准的模型，可供一些底层库使用，例如字节码解析和生成的库 ASM、反射库等。大多数 Java 开发人员不需要使用它。

### 支持数字的紧凑格式化

NumberFormat 增加了对以紧凑形式格式化数字的支持，紧凑格式是一种短并且人类可读的格式，比如 1K 表示 1000，1M 表示100万。

```java
NumberFormat fmt = NumberFormat.getCompactNumberInstance(Locale.US, NumberFormat.Style.SHORT);
String result = fmt.format(1000);// 1K
```

### 支持日本新年号的方形字符

> 2019年4月1日，日本官房长官菅义伟宣布，“令和”被选为日本新年号，是日本第126代天皇的年号。2019年4月3日，日本外务省就新年号“令和”向外国媒体公布了官方英文翻译：“Beautiful Harmony”，为“美丽和谐”之意。2019年5月1日零时（日本东京时间），日本正式启用“令和”为年号。

unicode 代码 U+32FF 用于表示 ㋿ ，这次 jdk 也做了支持。

```java
String 令和 =  "\u32FF"
```

### ZGC 并发类卸载

ZGC 现在支持类的卸载了，并且是并发执行的，不会对 gc 时间产生影响。这个特性默认是开启的，可以通过参数 -XX:-ClassUnloading 来禁用。

### 在备用内存设备上分配老年代

G1 和并行 GC 增加了实验性功能，允许他们将 Java 堆的老年代分配到备用内存设备上，例如 NV-DIMM 内存。当今的操作系统通过文件系统暴露 NV-DIMM 内存设备，可以通过参数 -XX:AllocateOldGenAt=<path> 指定路径来启用此特性。

### HotSpot 可以正确检测 windows server 2019

之前 Windows Server 2019 会被识别为 Windows Server 2016。

### 命令行参数 -XX+ExtensiveErrorReports

-XX+ExtensiveErrorReports 参数允许将更多关于崩溃的报告信息写入错误日志 hs_err<pid>.log 中。默认是关闭的，在一些需要最大的信息的情况下可以开启。

### 系统属性 java.security.manager 

可以对系统属性 java.security.manager 设置两个值：disallow 和 allow。如果设置为 disallow , System.setSecurityManager 将不能调用，抛出异常：UnsupportedOperationException。SecurityManager 在 jdk17 中已经被废弃了。

### keytool 添加参数 -groupname

keytool -genkeypair 添加了新的 -groupname 选项，以便用户在生成密钥对时可以指定命名组。

```
keytool -genkeypair -keyalg EC -groupname secp384r1
```

### JFR （Java Flight Recorder）添加新事件

JFR 新增加了4个事件：

- jdk.SecurityPropertyModification
- jdk.TLSHandshake
- jdk.X509Validation
- jdk.X509Certificate

### 自定义 PKCS12 密钥生成

添加了新的系统属性和安全属性用于自定义PKCS #12 密钥，可以 java.security 文件中进行配置，在 PKCS12 KeyStore properties 章节中可以找到详细的属性配置。

下面是 jdk 安装目录下 conf/java.security 文件的相关配置：

```properties
#
# PKCS12 KeyStore properties
#
# The following properties, if configured, are used by the PKCS12 KeyStore
# implementation during the creation of a new keystore. Several of the
# properties may also be used when modifying an existing keystore. The
# properties can be overridden by a KeyStore API that specifies its own
# algorithms and parameters.
#
# If an existing PKCS12 keystore is loaded and then stored, the algorithm and
# parameter used to generate the existing Mac will be reused. If the existing
# keystore does not have a Mac, no Mac will be created while storing. If there
# is at least one certificate in the existing keystore, the algorithm and
# parameters used to encrypt the last certificate in the existing keystore will
# be reused to encrypt all certificates while storing. If the last certificate
# in the existing keystore is not encrypted, all certificates will be stored
# unencrypted. If there is no certificate in the existing keystore, any newly
# added certificate will be encrypted (or stored unencrypted if algorithm
# value is "NONE") using the "keystore.pkcs12.certProtectionAlgorithm" and
# "keystore.pkcs12.certPbeIterationCount" values defined here. Existing private
# and secret key(s) are not changed. Newly set private and secret key(s) will
# be encrypted using the "keystore.pkcs12.keyProtectionAlgorithm" and
# "keystore.pkcs12.keyPbeIterationCount" values defined here.
#
# In order to apply new algorithms and parameters to all entries in an
# existing keystore, one can create a new keystore and add entries in the
# existing keystore into the new keystore. This can be achieved by calling the
# "keytool -importkeystore" command.
#
# If a system property of the same name is also specified, it supersedes the
# security property value defined here.
#
# If the property is set to an illegal value,
# an iteration count that is not a positive integer, or an unknown algorithm
# name, an exception will be thrown when the property is used.
# If the property is not set or empty, a default value will be used.
#
# Note: These properties are currently used by the JDK Reference implementation.
# They are not guaranteed to be examined and used by other implementations.

# The algorithm used to encrypt a certificate. This can be any non-Hmac PBE
# algorithm defined in the Cipher section of the Java Security Standard
# Algorithm Names Specification. When set to "NONE", the certificate
# is not encrypted. The default value is "PBEWithHmacSHA256AndAES_256".
#keystore.pkcs12.certProtectionAlgorithm = PBEWithHmacSHA256AndAES_256

# The iteration count used by the PBE algorithm when encrypting a certificate.
# This value must be a positive integer. The default value is 10000.
#keystore.pkcs12.certPbeIterationCount = 10000

# The algorithm used to encrypt a private key or secret key. This can be
# any non-Hmac PBE algorithm defined in the Cipher section of the Java
# Security Standard Algorithm Names Specification. The value must not be "NONE".
# The default value is "PBEWithHmacSHA256AndAES_256".
#keystore.pkcs12.keyProtectionAlgorithm = PBEWithHmacSHA256AndAES_256

# The iteration count used by the PBE algorithm when encrypting a private key
# or a secret key. This value must be a positive integer. The default value
# is 10000.
#keystore.pkcs12.keyPbeIterationCount = 10000

# The algorithm used to calculate the optional MacData at the end of a PKCS12
# file. This can be any HmacPBE algorithm defined in the Mac section of the
# Java Security Standard Algorithm Names Specification. When set to "NONE",
# no Mac is generated. The default value is "HmacPBESHA256".
#keystore.pkcs12.macAlgorithm = HmacPBESHA256

# The iteration count used by the MacData algorithm. This value must be a
# positive integer. The default value is 10000.
#keystore.pkcs12.macIterationCount = 10000
```

### ChaCha20 和Poly1305 TLS 密码库套件

使用 ChaCha20-Poly1305 算法的新 TLS 密码套件已添加到 JSSE（Java Secure Socket Extension）。

### krb5.conf 支持 dns_canonicalize_hostname

dns_canonicalize_hostname 选项表示名称查找是否将使用规范化主机名用于服务主体名称。如果设置为 false，可以通过减少对 DNS 的依赖来提高安全性，但是使用的有可能是短名称，而不是全限域名。这个标记默认是 true ，jdk12 之前也是，只是 jdk12 开始才可以设置。

### jdeps --print-module-deps 报告传递性依赖

jdeps 的 --print-module-deps,--list-deps, 和--list-reduce-deps 做了增强，之前显示程序中直接指定的依赖，现在传递依赖的模块也可以被显示出来了。

### Switch 表达式

case 后的冒号现在可以写成 -> ，后面跟上简短的表达式，并且新语法，不会出现下落的情况了，你不需要写break 。


```java
Integer flag = 1;
switch (flag) {
  case 1:
    System.out.println("1");
  case 3:
    System.out.println("3");
}
// 输入 1 3
System.out.println("----------------------");
// 新语法
switch (flag) {
  case 1 -> System.out.println("1");
  case 3 -> System.out.println("1");
}
// 只输出 1
```

### 删除 oracle 发行版本号中的 YY.M 供商版本号

11 版本的版本号显示：

```
java 11 2018-09-25
Java(TM) SE Runtime Environment 18.9 (build 11+28)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11+28, mixed mode)
```

12 版本的版本号，第二行有区别，没有年月信息版本号：

java 12 2019-03-19
Java(TM) SE Runtime Environment (build 12+17)
Java HotSpot(TM) 64-Bit Server VM (build 12+17, mixed mode)

### 其它被删除的特性和选项

- 删除类 com.sun.awt.SecurityWarning
- FileInputStream 和FileOutputStream 中的 finalize 方法删除，之前的版本已经废弃 finalize 方法绑定资源关闭的操作
- 删除 java.util.ZipFile/Inflator/Deflator 中的 finalize 方法
- 删除证书 GTE CyberTrust Global Root
- javac 不再支持 source, target, 和 release 不再支持 6/1.6
- 删除 AOL 和 Swisscom 根证书
- 从 SSLContext 必需算法中删除了 TLS v1 和 v1.1

### 废弃的特性

- 废除选项 -XX:-MonitorInUseLists
- keytool 中 -keyalg 默认值删除，如果没有指定就会有警告
- 禁用 TLS anon 和 NULL Cipher Suites
- 禁用所有 DES TLS 密码套件

### Swing 不再支持 GTK+ 3.20 及更晚的版本

由于 GTK 3.20 版本的不再向前兼容，swing 中部分组件可能会无法正常展示，可以通过参数 -Djdk.gtk.version=2.2 设置系统属性让 jdk 向操作系统请求使用更早的版本。

### 系统属性 user.timezone 发生改变

user.timezone 如果没有设置，将会使用系统默认。在之前的版本会返回空串，在 jdk12 中 System.getProperty("user.timezone")可能返回 null。

### URLPermission 的 query  和 Fragments 部分特性发生变化

之前已经计划要忽略，只是没有实现，现在按照规范实现了，所以之前可能校验会出错的，现在可以通过。

下面是 URLPermission  地址结构：

```
scheme : // authority [ / path ] [ ignored-query-or-fragment ]
```

### Properties.loadFromXML 遵守规范

Properties.loadFromXML 将遵守定义，如果加载的 xml 文件不是 Properties.storeToXML 生成的，并且包含了dtd 定义且不是 Properties.loadFromXML 中指定的格式将会抛出 InvalidPropertiesFormatException 。

下面是 Properties.storeToXML 生成的文件：

```xml
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
```

### LDAPS 通讯失败

使用 LDAPS 且套接字连接超时 <= 0（默认值）的应用程序代码在建立连接时可能会遇到异常。

### G1 可能在标记阶段取消提交内存

默认情况下 G1 会在并发标记阶段归还内存，这样可以提高内存的利用率。同时，G1 也会遵守 Java 的内存策略，通过 -Xms 参数可以禁用 G1 的这种行为。

### 如果使用了 JVMCI 编辑器 can_pop_frame 和 can_force_early_return 被禁用

如果使用了 JVMCI 编辑器（如 Graal），JVMTI 和  can_pop_frame 和 can_force_early_return 将被禁用。

### linux 原生代码检查

在 Linux 上启用了额外的保护措施，以防止本机代码中的缓冲区溢出。如果遇到缓冲区溢出，系统将写入消息“stack smashing detected”，程序将退出。

### 添加了额外的 TeliaSonera 根证书

下面的根证书添加到 openjdk 的信任证书库：

```
TeliaSonera
   teliasonerarootcav1
   DN: CN=TeliaSonera Root CA v1, O=TeliaSonera
```

### 不信任 Symantec Root CAs 锚定的 TLS 服务器证书

JDK 将停止信任 Symantec 颁发的 TLS 服务器证书。与谷歌、Mozilla、苹果和微软最近宣布的类似计划一致。受影响的证书列表包括品牌为 GeoTrust、Thawte 和 VeriSign 的证书，这些证书由 Symantec 管理。
