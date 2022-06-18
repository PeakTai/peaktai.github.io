### 支持会计风格的货币格式

通过 NumberFormat.getCurrencyInstance(Locale) 可以获取会计风格的货币格式，只对部分 locale 支持。下面是中国货币代码示例：

```java
final NumberFormat format = NumberFormat.getCurrencyInstance(Locale.CHINA);
System.out.println(format.format(0.5));// ¥0.50
```

### record

引入了 record 语法，可以非常简单方便的申明一个装载有不可变数据的类，使用 record 申明的类不能继承别的类， 而是隐含的继承自 java.lang.Record，并且不需要去写 toString、hashCode、equals 这些重复性高方法了。

```java
record Point(int x, int y) { }
Point p = new Point(2, 3);
System.out.println(p instanceof java.lang.Record);// true
// x 是 final 修饰的，不可更改
// Cannot assign a value to final variable 'x'
// p.x = 3
System.out.println(p.x);// 2
System.out.println(p.x());// 2
// toString()
System.out.println(p); // Point[x=2, y=3]
// hashCode()
System.out.println(p.hashCode());// 65
// equals()
Point p2 = new Point(2, 3);
System.out.println(p2.equals(p));// true
```

### 重新明确 ReadableByteChannel.read() 相关的方法

DatagramChannel.receive(),FileChannel.read(ByteBuffer,long),ReadableByteChannel.read(), 和ScatteringByteChannel.read() 的规范做了更新，如果传入的参数 buffer 参数是只读的， 将会抛出
IllegalArgumentException异常，调整后更符合实际的情况。 调整前，实际的情况是如果传入的 buffer 是只读的，将会抛出 ReadOnlyBufferException 与之前的规范不符。

### ZGC 支持 Windows 和 Mac os

ZGC 现在作为一个实验性功能可以在 windows 和 Mac os 上使用了， 通过参数
-XX:+UnlockExperimentalVMOptions -XX:+UseZGC 开启 。

### Parallel GC 提升

Parallel GC 采用了与其他收集器相同的任务管理机制来调度并行任务，这可能会导致显着的性能改进。也因此，这几个参数被废弃了：-XX:BindGCTaskThreadsToCPUs,-XX:UseGCTaskAffinity,-XX:GCTaskTimeStampEntries。

### G1 支持 NUMA-Aware 内存分配

G1 垃圾收集器现在尝试跨垃圾收集在年轻代中的同一 NUMA
节点上分配和保留对象，这有可能会带来显著的性能提升。

> 非统一内存访问（NUMA）是一种计算机内存设计，用于多重处理，其中内存访问时间取决于内存相对于处理器的位置。处理器可以利用NUMA的优势，优先访问本地内存（速度更快），而不是访问非本地内存（这意味着它不会访问另一个处理器的本地内存或处理器之间共享的内存）。

NUMA 有可能会导致内存倾斜，G1 会尝试使用严格的 interleave 策略将 Humongous 和 Old 区域均匀分布在所有可用的 NUMA 节点上。

### JFR 事件流

JFR （JDK Flight Recorder）现在支持通过 jdk 内包 jdk.jfr.consumer 下的新 API 消费事件来支持持续对应用进行监控。这意味着不管进程内还是进程外都可以消费最后一秒的记录。

### 默认禁用 TLS、CertPath 和签名 JAR 中的弱命名曲线

默认情况下，通过将弱命名曲线添加到以下 disabledAlgorithms 安全属性来禁用它们：jdk.tls.disabledAlgorithms、jdk.certpath.disabledAlgorithms 和 jdk.jar.disabledAlgorithms。

### Apache Santuario 升级到 2.1.4

内置的 Apache Santuario 升级到了 2.1.4，引入了新的系统属性
com.sun.org.apache.xml.internal.security.parser.pool-size 。 Apache Santuario 是 xml 安全规范的一种实现。

### org.xml.sax.ContentHandler 中添加了新方法用于处理 xml 申明

org.xml.sax.ContentHandler 添加了新方法 declaration 用于来接收 xml
申明通知，默认是空方法，不做任何处理。

### 删除 Pack200 工具和相关的 API

pack200 在 java 11 中就已经废弃了，pack200 是一个用于压缩 jar 包的工具，自 jdk5 中引入。此次不仅删除了工具 pack200
，相关的类和接口也一并删除：java.util.jar.Pack200、java.util.jar.Pack200.Packer、java.util.jar.Pack200.Unpacker。

### 线程暂停恢复相关方法标记为待删除

- Thread.suspend()
- Thread.resume()
- ThreadGroup.suspend()
- ThreadGroup.resume()
- ThreadGroup.allowThreadSuspension(boolean)

这些方法自 1.2 版本开始就标记为废弃了，这次只是将 Deprecated 注解的属性 forRemoval 属性设置为 true，标记下将来版本要删除。

### 其它删除的特性

- Thread.suspend()
- Thread.resume()
- ThreadGroup.suspend()
- ThreadGroup.resume()
- ThreadGroup.allowThreadSuspension(boolean)

### 其它废弃的特性和选项

- 废弃 NSWindowStyleMaskTexturedBackground，新版本的 macos 已经废弃了相关的特性
- 废弃 ParallelScavenge + SerialOld 的回收器组合
- 将遗留的椭圆曲线算法废弃，标记为待删除，brainpoolP256r1, brainpoolP320r1, brainpoolP384r1,brainpoolP512r1等
- 废弃 OracleUcrypto JCE Provider