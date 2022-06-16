java 10 主要的更新是增强，对部分 api 做了改进，没有引入太多新功能。

### 基于时间的版本

调整了版本号模式，增加了基于时间的子版本号。下面是我电脑上的 jdk17 的版本信息，相比 jdk8 的版本号后面多了个日期。

```
java version "17.0.1" 2021-10-19 LTS
Java(TM) SE Runtime Environment (build 17.0.1+12-LTS-39)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.1+12-LTS-39, mixed mode, sharing)
```

### 语言标签增强

增加了对 BCP 47 语言标签的补充扩展，如下：

- cu (currency type)
- fw (first day of week)
- rg (region override)
- tz (time zone)

这些标签将会被 java.util.Locale 和相关的 API 支持

### 类型推断增强

引入关键字 var ，用于申明可以被推断的类型，例如：

```
var list = new ArrayList<String>();// list 被推断为 ArrayList<String>
```

### ptional 增加 orElseThrow() 方法

Optional 添加了 orElseThrow 方法，作为替代 get 方法的首先方法。

### 创建不可修改集合的API

新增List.copyOf、Set.copyOf和Map.copyOf 用于从已有信息复制出新实例，新实例是不可修改的。新方法 toUnmodifiableList、toUnmodifiableSet 和 toUnmodifiableMap 已添加到 Stream 包中的 Collectors 类，这些方法适合于将 stream 最终转换成不可变集合。

### 开箱即用 JMX 代理的散列密码

在以前，JMX存储的是明文密码，现在用户提供明文密码，jmx 来做加密存储。

### G1回收器并行 Full GC

通过并行 Full GC 来改善 G1 最坏情况下的延迟。G1 垃圾收集器旨在避免完全收集，但是当并发收集不能足够快的回收内存，就会发生 Full GC。原来的 Full GC 实现使用的是一个单线程，采用 mark-sweep-compact 算法，为了提升发生 Full GC 时的用户体验，让 Full GC 并行。通过参数 -XX:ParallelGCThreads 可以设置线程数，这个参数同样会影响到 Young GC 和 Mixed GC。

### 根证书

在 JDK 中提供一组默认的CA根证书。jdk9 默认是无法使用 TLS 的，用户必须通过 javax.net.ssl.trustStore 系统属性来设置密钥库，非常的不方便。

### 增强 for 循环的字节码生成

增强 for 循环的字节生成做了改进。例如：

```java
List<String> data = new ArrayList<>(); 
for (String b : data);
```

以下是增强后生成的代码：

```
Iterator i$ = data.iterator(); 
for (; i$.hasNext(); ) {
  String b = (String)i$.next(); 
} 
b = null; 
i$ = null;
```

在 for 循环的外面申明一个迭代变量，当不再被使用时被赋值为 null，这让 gc 可以访问到它，清理掉无用内存。

这个优化是为了修复 JDK-8175883，当有数组占用达到一半内存，使用增强 for 循环迭代后数组置空，后面仍然不能分配一半内存的数组。

```java
final int HALF_OF_MEMORY = (int) (Runtime.getRuntime().maxMemory() * 0.5);

byte[] data = new byte[HALF_OF_MEMORY];

for (byte b : data); // <-- if you comment this line - the application finished successfully
data = null; // this expects to discard reference -> allow to release the memory

byte[] data2 = new byte[HALF_OF_MEMORY]; // the memory can't be allocated second time, if the "for" loop statement above is used

System.out.println("Success");
```

实测并没有效果，仍然会发生 OutOfMemoryError ，并不能回收内存继续分配，看到 stack overflow 上也有人说到这个优化实际上并不奏效。

### javadoc 支持多个样式表

javadoc 可以通过选项 --add-stylesheet 来添加多个样式表。

```
javadoc --add-stylesheet new_stylesheet_1.css --add-stylesheet new_stylesheet_2.css pkg_foo 
```

### 在详细资料部分或概要部分中的文档覆盖方法

java doc 通过 --override-methods (detail|summary) 参数要指定在detail 或 summary 中生成覆写方法信息。

经测试没有作用，不知道是不是我使用的jdk 版本问题，还是理解的不对，javadoc 文档中对这个参数的说明也非常的少。

### javadoc 增加 @summary 标签

通过在注释中添加行内标签 @summary 可以指定明确的文本作为 api 的摘要信息，之前都是用的第一句话。但是仅仅当 @summary 在开头时才会有效，感觉用处不大。下面是我的测试：

```java
/**
 * {@summary 这个方法用于测试}, 这里是方法的说明，很长很长.
 */
 public void m1() {

 }

 /**
   * 这个方法用于测试, 这里是方法的说明，很长很长.
   */
 public void m2(){

 }
```

![生成的 api 效果](/assets/blogs/2022/java-10-features/api文档效果.jpg)

### 字节码文件的版本升级至 54.0

jdk10 没有引进新的特性，仅仅是提升了字节码文件的主版本号。后面每个 jdk 版本，都会调整字节码文件的版本号，用于识别源码使用的 java 版本，确认是否可以运行。

### Swing/AWT 文本组件支持触控键盘

swing 的文本组件在 win8 及更新的版本中支持自动调出触控键盘。

### java.awt.TrayIcon.displayMessage() 在 macos 上重新实现

java.awt.TrayIcon.displayMessage() 在 macos 上使用 NSUserNotification 重新实现。现在的实现使用标准的通知中心，不再是自定义的一个窗口了。

### 减轻 FileInputStream/FileOutputStream 使用 finalize 调用 close 的压力

假如 FileInputStream 没有关闭，将会依赖于 finalize 执行 close，这种情况会突然给 gc 增加额外的工作。

如果 FileInputStream/FileOutputStream 的子类覆写了 close()，当 FileInputStream/FileOutputStream 对象不可达时（gc 时的可达性分析），close() 方法会被调用。

总之，不要依赖于通过 finalize 自动关闭流。关闭流，只有直接调用 close() 或者通过 try-with-resources 才可靠。

### bootstrap 类加载器跳过空路径

bootstrap 类加载器已更改为在定位资源时跳过 -Xbootclasspath/a 中指定的空元素。

### RMI Registry Filter 允许绑定任何类型的数组

RMI Registry 内建的几个过滤器已经修改为只检查数组大小，而不检查元素类型。RMI 在后面的 jdk15 中被废弃了，我个人在工作中从来没有使用过，了解的也不多。

### hotspot 通过统一日志打印追踪信息

TraceYoungGenTime 和 TraceOldGenTime 标记被删除，现在同样的信息可以使用统一日志设置 gc+heap+exit 为 debug 级别。

```
java -Xlog:gc+heap+exit=debug
```

### 更改 BiasedLockingStartupDelay 默认值

hostspot 将 BiasedLockingStartupDelay 默认值改为 0，之前是 4000(4s)，之前是为了性能，现在看来并没有什么差别。偏向锁（Biased Locking）在后面的 jdk15 中被废弃了，最初的是为了提升性能，减少非竞争锁定的开销，但是在今天看来提升非常有限，而且还增加了（hotspot）代码的复杂度。

### 针对 docker 容器的改进

hotspot 引进了一些变更，提高 java 在 docker 容器中运行时的配置性。

| 参数         | 说明
| :------------- |:-----------------------------------------------
| -XX:-UseContainerSupport                     | 启动容器支持       | 
| -XX:ActiveProcessorCount=count               | 指定虚拟机使用的cpu核心数       | 
| -XX:InitialRAMPercentage<br>-XX:MaxRAMPercentage<br>-XX:MinRAMPercentage       | 弹性的百分比内存控制，方便用户通过容器参数来分配内存       | 

### 接受在 krb5.conf 的配置的 includedir 中所包含 .conf 文件

如果 krb5.conf 中配置了 "includedir DIRNAME" 指令，并且配置的目录下有后缀为 .conf 的文件，这些文件会被包含到 krb5.conf 中。

Kerberos 是一种计算机网络授权协议，用来在非安全网络中，对个人通信以安全的手段进行身份认证，目前被广泛运用在大数据生态中。Java 原生提供了对 kerberos 协议的支持，作为 Java SE 中单点登录的底层技术。

### jshell 启动速度提升

jshell 启动时间大大缩减，尤其是当启动一个脚本文件包含大量代码片段的情况下。

### 一些删除的功能

- 删除对旧版本 LookAndFeel 的支持，
- 删除 Runtime.getLocalizedInputStream 和 getLocalizedOutputStream
- 删除对 RMI服务器端多路复用协议的支持，jdk9 中就已经禁用
- 删除通用的 dom api
- hotspot 移除 FlatProfiler，FlatProfiler 需要扫描 gc root ，有严重的 bug ，不再有技术价值
- 选项 -Xoss,-Xsqnopause,-Xoptimize,-Xboundthreads, 和-Xusealtsigs 删除
- JavaFX 删除 T2K Rasterizer，ICU Layout Engine 和 VP6/FXM/FLV 编码
- 部分 SecurityManager 中废弃的变量和方法删除
- policytool 工具从 sdk 中移除
- 删除包 Classes in com.sun.security.auth 下废弃的类
- 旧版本 Doclet 删除，之前 jdk 9 中对 Doclet api 做了简体，但是旧版本仍然保留，这次删除了
- 移除工具 javah，使用 javac -h 替代，javah 工具用来生成实现的本地方法（native methid）所需要的 c 语言文件头和源码
- 参数 -d32, -d64, -J-d32 和 -J-d64 移除