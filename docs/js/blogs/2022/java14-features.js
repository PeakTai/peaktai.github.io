(function(e){function n(n){for(var t,o,u=n[0],c=n[1],i=n[2],s=0,b=[];s<u.length;s++)o=u[s],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&b.push(r[o][0]),r[o]=0;for(t in c)Object.prototype.hasOwnProperty.call(c,t)&&(e[t]=c[t]);p&&p(n);while(b.length)b.shift()();return a.push.apply(a,i||[]),l()}function l(){for(var e,n=0;n<a.length;n++){for(var l=a[n],t=!0,u=1;u<l.length;u++){var c=l[u];0!==r[c]&&(t=!1)}t&&(a.splice(n--,1),e=o(o.s=l[0]))}return e}var t={},r={"blogs/2022/java14-features":0},a=[];function o(n){if(t[n])return t[n].exports;var l=t[n]={i:n,l:!1,exports:{}};return e[n].call(l.exports,l,l.exports,o),l.l=!0,l.exports}o.m=e,o.c=t,o.d=function(e,n,l){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:l})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var l=Object.create(null);if(o.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var t in e)o.d(l,t,function(n){return e[n]}.bind(null,t));return l},o.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],c=u.push.bind(u);u.push=n,u=u.slice();for(var i=0;i<u.length;i++)n(u[i]);var p=c;a.push([7,"chunk-vendors","chunk-common"]),l()})({7:function(e,n,l){e.exports=l("c5b9")},c5b9:function(e,n,l){"use strict";l.r(n);var t=l("f2bf"),r=l("6226"),a=l("8c98");const o=Object(t["g"])("h3",null,"支持会计风格的货币格式",-1),u=Object(t["g"])("p",null," 通过 NumberFormat.getCurrencyInstance(Locale) 可以获取会计风格的货币格式，只对部分 locale 支持。下面是中国货币代码示例： ",-1),c=Object(t["g"])("h3",null,"record",-1),i=Object(t["g"])("p",null," 引入了 record 语法，可以非常简单方便的申明一个装载有不可变数据的类，使用 record 申明的类不能继承别的类， 而是隐含的继承自 java.lang.Record，并且不需要去写 toString、hashCode、equals 这些重复性高方法了。 ",-1),p=Object(t["g"])("h3",null,"重新明确 ReadableByteChannel.read() 相关的方法",-1),s=Object(t["g"])("p",null," DatagramChannel.receive(),FileChannel.read(ByteBuffer,long),ReadableByteChannel.read(), 和ScatteringByteChannel.read() 的规范做了更新，如果传入的参数 buffer 参数是只读的， 将会抛出 IllegalArgumentException异常，调整后更符合实际的情况。 调整前，实际的情况是如果传入的 buffer 是只读的，将会抛出 ReadOnlyBufferException 与之前的规范不符。 ",-1),b=Object(t["g"])("h3",null,"ZGC 支持 Windows 和 Mac os",-1),d=Object(t["g"])("p",null," ZGC 现在作为一个实验性功能可以在 windows 和 Mac os 上使用了， 通过参数 -XX:+UnlockExperimentalVMOptions -XX:+UseZGC 开启 。 ",-1),g=Object(t["g"])("h3",null,"Parallel GC 提升",-1),j=Object(t["g"])("p",null," Parallel GC 采用了与其他收集器相同的任务管理机制来调度并行任务，这可能会导致显着的性能改进。 也因此，这几个参数被废弃了：-XX:BindGCTaskThreadsToCPUs,-XX:UseGCTaskAffinity, -XX:GCTaskTimeStampEntries。 ",-1),O=Object(t["g"])("h3",null,"G1 支持 NUMA-Aware 内存分配",-1),h=Object(t["g"])("p",null," G1 垃圾收集器现在尝试跨垃圾收集在年轻代中的同一 NUMA 节点上分配和保留对象，这有可能会带来显著的性能提升。 ",-1),f=Object(t["g"])("blockquote",null," 非统一内存访问（NUMA）是一种计算机内存设计，用于多重处理，其中内存访问时间取决于内存相对于处理器的位置。 处理器可以利用NUMA的优势，优先访问本地内存（速度更快），而不是访问非本地内存（这意味着它不会访问另一个处理器的本地内存或处理器之间共享的内存）。 ",-1),m=Object(t["g"])("p",null," NUMA 有可能会导致内存倾斜，G1 会尝试使用严格的 interleave 策略将 Humongous 和 Old 区域均匀分布在所有可用的 NUMA 节点上。 ",-1),y=Object(t["g"])("h3",null,"JFR 事件流",-1),v=Object(t["g"])("p",null," JFR （JDK Flight Recorder）现在支持通过 jdk 内包 jdk.jfr.consumer 下的新 API 消费事件来支持持续对应用进行监控。这意味着不管进程内还是进程外都可以消费最后一秒的记录。 ",-1),P=Object(t["g"])("h3",null,"默认禁用 TLS、CertPath 和签名 JAR 中的弱命名曲线",-1),k=Object(t["g"])("p",null," 默认情况下，通过将弱命名曲线添加到以下 disabledAlgorithms 安全属性来禁用它们： jdk.tls.disabledAlgorithms、jdk.certpath.disabledAlgorithms 和 jdk.jar.disabledAlgorithms。 ",-1),S=Object(t["g"])("h3",null,"Apache Santuario 升级到 2.1.4",-1),x=Object(t["g"])("p",null," 内置的 Apache Santuario 升级到了 2.1.4，引入了新的系统属性 com.sun.org.apache.xml.internal.security.parser.pool-size 。 Apache Santuario 是 xml 安全规范的一种实现。 ",-1),C=Object(t["g"])("h3",null,"org.xml.sax.ContentHandler 中添加了新方法用于处理 xml 申明",-1),T=Object(t["g"])("p",null," org.xml.sax.ContentHandler 添加了新方法 declaration 用于来接收 xml 申明通知，默认是空方法，不做任何处理。 ",-1),A=Object(t["g"])("h3",null,"删除 Pack200 工具和相关的 API",-1),w=Object(t["g"])("p",null," pack200 在 java 11 中就已经废弃了，pack200 是一个用于压缩 jar 包的工具，自 jdk5 中引入。 此次不仅删除了工具 pack200 ，相关的类和接口也一并删除：java.util.jar.Pack200、java.util.jar.Pack200.Packer、 java.util.jar.Pack200.Unpacker。 ",-1),G=Object(t["g"])("h3",null,"线程暂停恢复相关方法标记为待删除",-1),M=Object(t["g"])("ul",null,[Object(t["g"])("li",null,"Thread.suspend()"),Object(t["g"])("li",null,"Thread.resume()"),Object(t["g"])("li",null,"ThreadGroup.suspend()"),Object(t["g"])("li",null,"ThreadGroup.resume()"),Object(t["g"])("li",null,"ThreadGroup.allowThreadSuspension(boolean)")],-1),U=Object(t["g"])("p",null," 这些方法自 1.2 版本开始就标记为废弃了，这次只是将 Deprecated 注解的属性 forRemoval 属性设置为 true，标记下将来版本要删除。 ",-1),N=Object(t["g"])("h3",null,"其它删除的特性",-1),R=Object(t["g"])("ul",null,[Object(t["g"])("li",null,"Thread.suspend()"),Object(t["g"])("li",null,"Thread.resume()"),Object(t["g"])("li",null,"ThreadGroup.suspend()"),Object(t["g"])("li",null,"ThreadGroup.resume()"),Object(t["g"])("li",null,"ThreadGroup.allowThreadSuspension(boolean)")],-1),X=Object(t["g"])("h3",null,"其它废弃的特性和选项",-1),B=Object(t["g"])("ul",null,[Object(t["g"])("li",null,"废弃 NSWindowStyleMaskTexturedBackground，新版本的 macos 已经废弃了相关的特性"),Object(t["g"])("li",null,"废弃 ParallelScavenge + SerialOld 的回收器组合"),Object(t["g"])("li",null," 将遗留的椭圆曲线算法废弃，标记为待删除，brainpoolP256r1, brainpoolP320r1, brainpoolP384r1, brainpoolP512r1等 "),Object(t["g"])("li",null,"废弃 OracleUcrypto JCE Provider")],-1);var J=Object(t["k"])({setup(e){return(e,n)=>(Object(t["r"])(),Object(t["d"])(a["a"],null,{default:Object(t["G"])(()=>[o,u,Object(t["j"])(r["a"],{code:"\n    final NumberFormat format = NumberFormat.getCurrencyInstance(Locale.CHINA);\n    System.out.println(format.format(0.5));// ¥0.50\n  ",language:"Java"}),c,i,Object(t["j"])(r["a"],{code:"\n    record Point(int x, int y) { }\n    Point p = new Point(2, 3);\n    System.out.println(p instanceof java.lang.Record);// true\n    // x 是 final 修饰的，不可更改\n    // Cannot assign a value to final variable 'x'\n    // p.x = 3\n    System.out.println(p.x);// 2\n    System.out.println(p.x());// 2\n    // toString()\n    System.out.println(p); // Point[x=2, y=3]\n    // hashCode()\n    System.out.println(p.hashCode());// 65\n    // equals()\n    Point p2 = new Point(2, 3);\n    System.out.println(p2.equals(p));// true\n  ",language:"java"}),p,s,b,d,g,j,O,h,f,m,y,v,P,k,S,x,C,T,A,w,G,M,U,N,R,X,B]),_:1}))}});const F=J;var _=F;Object(t["c"])(_).mount("#app")}});