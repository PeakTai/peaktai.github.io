### CharSequence 增加 isEmpty 默认方法

CharSequence 新增了 isEmpty 方法，用于判定字符序列是否为空。

```java
default boolean isEmpty() {
  return this.length() == 0;
}
```

### 支持 unicode 13

 java.lang.Character 支持了 unicode 13.0 新增的 5930 个字符，其中包含 4 个新脚本，以及 55 个新的 emoji 表情字符。

### 隐藏类

引入隐藏类，也就是不能被直接使用的类。隐藏类旨让框架可以在运行时生成类并通过反射间接使用，这个可以在运行时动态的重新实现一部分功能，隐藏类可以定义为访问控制巢的成员，并且可以独立卸载。

下面是简单的示例，首先得创建一个字节码文件，其源码如下：

```java
package org.example.reflex;
import java.util.function.Supplier;
public class Demo implements Supplier<String> {
    @Override
    public String get() {
        return "hello";
    }
}
```

隐藏类需要实现接口或者继承一个类，因为隐藏类不能通过反射直接调用，需要将创建的隐藏类实例强转成接口或父类。这里仅仅是为了演示，对于框架来说可以使用 asm 之类的技术在运行时动态生成字节码数据。

```java
// 加载字节码文件，读取为字节数组
final InputStream ins = Demo2.class.getClassLoader().getResourceAsStream("Dembytes");
final byte[] bytes = ins.readAllBytes()
// 获取有完整权限的 lookup
final MethodHandles.Lookup lookup = MethodHandles.lookup();
// 创建隐藏类
final MethodHandles.Lookup hiddenClassLookup =
lookup.defineHiddenClass(bytes, true, MethodHandles.Lookup.ClassOption.NESTMATE)
final Class<?> clazz = hiddenClassLookup.lookupClass();
// Class::getName 返回的名称里会带有斜杠 /
System.out.println(clazz.getName());
// 输出 org.example.reflex.Demo/0x0000000800c01880
// org.example.reflex.Demo 是隐藏类的全限名称，与正常的类相比多了斜杠及后面部
System.out.println(clazz.descriptorString());
// 输出 Lorg/example/reflex/Demo.0x0000000800c01880;
// 与正常的类相比，多了点号及后面部
// 调用 get 方法
final Object instance = clazz.getDeclaredConstructor().newInstance();
Supplier<String> demo = (Supplier<String>) instance;
System.out.println(demo.get())
// 下面的代码会报错，无法通过反射查找到隐藏类的 method
final MethodHandle method = hiddenClassLookup.findVirtual(
      clazz, "get", MethodType.methodType(void.class));
final Object result = method.invokeExact(instance);
System.out.println(result);
```

### 支持 SO_INCOMING_NAPI_ID

ExtendedSocketOptions 中增加了新的 socket 选项 SO_INCOMING_NAPI_ID。 这个选项是Linux专用的，允许应用程序查询与其套接字连接相关的底层设备队列的 NAPI ID，并利用高性能网络接口卡（NIC）设备的应用设备队列（ADQ）功能。

### TreeMap 中专门的实现方法

TreeMap 中对这些方法进行了覆写：putIfAbsent、computeIfAbsent、computeIfPresent、compute 和 merge 。 新覆写的这些方法相比 Map 接口中的默认方法实现提升了性能。

### JMX 支持配置第三个端口

JMX 支持通过配置两个网络端口：

* `com.sun.management.jmxremote.port=<port#>`
* `com.sun.management.jmxremote.rmi.port=<port#>`

现在新增了一个本地端口配置:

`com.sun.management.jmxremote.local.port=<port#>`

### jstatd 添加了新的选项用于指定 RMI 连接端口号

新的参数 -r &lt;port&gt; 添加到了 jstatd 用于指定 RMI
商品号，如果没有指定，将会使用一个随机端口号。

### jcmd 添加了新选项用于将堆信息导出为 gzip 压缩包

新的整型选项 gz 添加到了诊断命令 heap_dump 中，值可以是 1 到 9 的数字，用于指定压缩级别。

### jhsdb 工具增加新选项用于 debug 模式

jhsdb 命令新未回了以下的选项用于 debug 模式：

* --rmiport &lt;port&gt; 用于指定 rmi 端口，未指定的情况下使用随机端口。
* --registryport &lt;port&gt; 用于指定 RMI 注册端口，未指定情况下使用系统属性，系统属性也没有设置则使用 1099。
* --hostname &lt;hostname&gt; 用于指定 RMI 连接的主机名。

### windows 安装包提供了 javac 等可执行文件到命令提示符可达的路径中

java 和 javac 等可执行文件被安装到系统路径中，这样用户就不需要配置环境变量了，可以直接在命令行中直接使用。

### jarsigner 增加吊消检查功能

新的 -revCheck 选项已添加到 jarsigner 命令以启用证书的吊销检查。jarsigner 是用于签名和校验 jar 文件的工具。

### 部分工具在使用弱算法的时候会有警告

keytool 和 jarsigner 工具已更新，在密钥、证书和签名 JAR 中使用弱加密算法时向用户发出警告。
通过 java.security 配置文件中的 jdk.security.legacyAlgorithms 属性可以设置弱算法。
当前版本会发出警告的算法：SHA-1 hash 和 1024-bit RSA/DSA keys.

### SunJCE Provider 支持基于 SHA-3 的 Hmac 算法

SunJCE provider 已得到增强，以支持 HmacSHA3-224、HmacSHA3-256、HmacSHA3-384 和 HmacSHA3-512。

### 新的系统属性用于配置 TLS 签名模式

新增了 jdk.tls.client.SignatureSchemes 和 jdk.tls.server.SignatureSchemes
 分别用于客户端和服务器端配置 TLS签名模式。

### 支持 certificate_authorities 扩展

ertificate_authorities 扩展是 TLS 1.3 中可选扩展，它用于表明一个端点支持的证书机构（CAs）。在这个版本certificate_authorities 扩展支持 TLS 1.3 的客户端和服务器端。

### krb5.conf 中增加对 canonicalize 的支持

现在已经支持了 canonicalize 选项，如果此标志设置为 true，则对 KDC（Key Distribution Center 密钥分发中心）的初始票据请求将要求客户端主体名称的规范化，并且接受与请求的主体不同的客户端主体的应答。

### 支持跨域 MSSFU

对 Kerberos MSSFU 的支持现在已经扩展到了跨域环境。

### 被删除的一些特性和选项

* 废弃 RMI 激活机制
* 废弃 NSWindowStyleMaskTexturedBackground，macOS 10.14 中已经将其废弃，后续不再支持
* 废弃参数 -XXForceNUMA
*  废弃偏向锁和偏向锁相关的标记，偏向锁可能会影响存在大量无竞争同步的应用的性能，这个版本默认被禁用 
* 默认禁用 SunEC 的本地实现
* ContentSigner 和 ContentSignerParameters 之前已经废弃，这个版本打上 forRemoval=true 标记      