(function(e){function t(t){for(var l,u,c=t[0],a=t[1],i=t[2],p=0,g=[];p<c.length;p++)u=c[p],Object.prototype.hasOwnProperty.call(r,u)&&r[u]&&g.push(r[u][0]),r[u]=0;for(l in a)Object.prototype.hasOwnProperty.call(a,l)&&(e[l]=a[l]);s&&s(t);while(g.length)g.shift()();return o.push.apply(o,i||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],l=!0,c=1;c<n.length;c++){var a=n[c];0!==r[a]&&(l=!1)}l&&(o.splice(t--,1),e=u(u.s=n[0]))}return e}var l={},r={"blogs/2022/java15-features":0},o=[];function u(t){if(l[t])return l[t].exports;var n=l[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.m=e,u.c=l,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)u.d(n,l,function(t){return e[t]}.bind(null,l));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],a=c.push.bind(c);c.push=t,c=c.slice();for(var i=0;i<c.length;i++)t(c[i]);var s=a;o.push([6,"chunk-vendors","chunk-common"]),n()})({6:function(e,t,n){e.exports=n("ee25")},ee25:function(e,t,n){"use strict";n.r(t);var l=n("f2bf"),r=n("8c98"),o=n("6226");const u=Object(l["g"])("h3",null,"CharSequence 增加 isEmpty 默认方法",-1),c=Object(l["g"])("p",null,"CharSequence 新增了 isEmpty 方法，用于判定字符序列是否为空。",-1),a=Object(l["g"])("h3",null,"支持 unicode 13",-1),i=Object(l["g"])("p",null," java.lang.Character 支持了 unicode 13.0 新增的 5930 个字符，其中包含 4 个新脚本，以及 55 个新的 emoji 表情字符。 ",-1),s=Object(l["g"])("h3",null,"隐藏类",-1),p=Object(l["g"])("p",null," 引入隐藏类，也就是不能被直接使用的类。隐藏类旨让框架可以在运行时生成类并通过反射间接使用，这个可以在运行时动态的重新实现一部分功能，隐藏类可以定义为访问控制巢的成员，并且可以独立卸载。 ",-1),g=Object(l["g"])("p",null,"下面是简单的示例，首先得创建一个字节码文件，其源码如下：",-1),j=Object(l["g"])("p",null," 隐藏类需要实现接口或者继承一个类，因为隐藏类不能通过反射直接调用，需要将创建的隐藏类实例强转成接口或父类。 这里仅仅是为了演示，对于框架来说可以使用 asm 之类的技术在运行时动态生成字节码数据。 ",-1),b=Object(l["g"])("h3",null,"支持 SO_INCOMING_NAPI_ID",-1),O=Object(l["g"])("p",null," ExtendedSocketOptions 中增加了新的 socket 选项 SO_INCOMING_NAPI_ID。 这个选项是Linux专用的， 允许应用程序查询与其套接字连接相关的底层设备队列的NAPI ID，并利用高性能网络接口卡（NIC）设备的应用设备队列（ADQ）功能。 ",-1),d=Object(l["g"])("h3",null,"TreeMap 中专门的实现方法",-1),m=Object(l["g"])("p",null," TreeMap 中对这些方法进行了覆写：putIfAbsent、computeIfAbsent、computeIfPresent、compute、 和merge 。 新覆写的这些方法相比 Map 接口中的默认方法实现提升了性能。 ",-1),h=Object(l["g"])("h3",null,"JMX 支持配置第三个端口",-1),f=Object(l["g"])("p",null,"JMX 支持通过配置两个网络端口：",-1),S=Object(l["g"])("ul",null,[Object(l["g"])("li",null,[Object(l["g"])("code",null,"com.sun.management.jmxremote.port=<port#>")]),Object(l["g"])("li",null,[Object(l["g"])("code",null,"com.sun.management.jmxremote.rmi.port=<port#>")])],-1),y=Object(l["g"])("p",null,"现在新增了一个本地端口配置：",-1),v=Object(l["g"])("p",null,[Object(l["g"])("code",null,"com.sun.management.jmxremote.local.port=<port#>")],-1),k=Object(l["g"])("h3",null,"jstatd 添加了新的选项用于指定 RMI 连接端口号",-1),M=Object(l["g"])("p",null," 新的参数 -r <port> 添加到了 jstatd 用于指定 RMI 商品号，如果没有指定，将会使用一个随机端口号。 ",-1),C=Object(l["g"])("h3",null,"jcmd 添加了新选项用于将堆信息导出为 gzip 压缩包",-1),x=Object(l["g"])("p",null,"新的整型选项 gz 添加到了诊断命令 heap_dump 中，值可以是 1 到 9 的数字，用于指定压缩级别。",-1),A=Object(l["g"])("h3",null,"jhsdb 工具增加新选项用于 debug 模式",-1),I=Object(l["g"])("p",null,"jhsdb 命令新未回了以下的选项用于 debug 模式：",-1),H=Object(l["g"])("ul",null,[Object(l["g"])("li",null,"--rmiport <port> 用于指定 rmi 端口，未指定的情况下使用随机端口。"),Object(l["g"])("li",null," --registryport <port> 用于指定 RMI 注册端口，未指定情况下使用系统属性，系统属性也没有设置则使用 1099。 "),Object(l["g"])("li",null,"--hostname <hostname> 用于指定 RMI 连接的主机名。")],-1),_=Object(l["g"])("h3",null,"windows 安装包提供了 javac 等可执行文件到命令提示符可达的路径中",-1),w=Object(l["g"])("p",null," java 和 javac 等可执行文件被安装到系统路径中，这样用户就不需要配置环境变量了，可以直接在命令行中直接使用。 ",-1),z=Object(l["g"])("h3",null,"jarsigner 增加吊消检查功能",-1),D=Object(l["g"])("p",null," 新的 -revCheck 选项已添加到 jarsigner 命令以启用证书的吊销检查。jarsigner 是用于签名和校验 jar 文件的工具。 ",-1),L=Object(l["g"])("h3",null,"部分工具在使用弱算法的时候会有警告",-1),N=Object(l["g"])("p",null," keytool 和 jarsigner 工具已更新，在密钥、证书和签名 JAR 中使用弱加密算法时向用户发出警告。 通过 java.security 配置文件中的 jdk.security.legacyAlgorithms 属性可以设置弱算法。 当前版本会发出警告的算法：SHA-1 hash 和 1024-bit RSA/DSA keys. ",-1),P=Object(l["g"])("h3",null,"SunJCE Provider 支持基于 SHA-3 的 Hmac 算法",-1),T=Object(l["g"])("p",null," SunJCE provider 已得到增强，以支持 HmacSHA3-224、HmacSHA3-256、HmacSHA3-384 和 HmacSHA3-512。 ",-1),E=Object(l["g"])("h3",null,"新的系统属性用于配置 TLS 签名模式",-1),R=Object(l["g"])("p",null," 新增了 jdk.tls.client.SignatureSchemes 和 jdk.tls.server.SignatureSchemes 分别用于客户端和服务器端配置 TLS签名模式。 ",-1),J=Object(l["g"])("h3",null,"支持 certificate_authorities 扩展",-1),X=Object(l["g"])("p",null," ertificate_authorities 扩展是 TLS 1.3 中可选扩展，它用于表明一个端点支持的证书机构（CAs）。 在这个版本certificate_authorities 扩展支持 TLS 1.3 的客户端和服务器端。 ",-1),F=Object(l["g"])("h3",null,"krb5.conf 中增加对 canonicalize 的支持",-1),G=Object(l["g"])("p",null," 现在已经支持了 canonicalize 选项，如果此标志设置为 true，则对 KDC（Key Distribution Center 密钥分发中心） 的初始票据请求将要求客户端主体名称的规范化，并且接受与请求的主体不同的客户端主体的应答。 ",-1),K=Object(l["g"])("h3",null,"支持跨域 MSSFU",-1),U=Object(l["g"])("p",null,"对 Kerberos MSSFU 的支持现在已经扩展到了跨域环境。",-1),q=Object(l["g"])("h3",null,"被删除的一些特性和选项",-1),B=Object(l["g"])("ul",null,[Object(l["g"])("li",null,"废弃 RMI 激活机制"),Object(l["g"])("li",null,"废弃 NSWindowStyleMaskTexturedBackground，macOS 10.14 中已经将其废弃，后续不再支持"),Object(l["g"])("li",null,"废弃参数 -XXForceNUMA"),Object(l["g"])("li",null," 废弃偏向锁和偏向锁相关的标记，偏向锁可能会影响存在大量无竞争同步的应用的性能，这个版本默认被禁用 "),Object(l["g"])("li",null,"默认禁用 SunEC 的本地实现"),Object(l["g"])("li",null," ContentSigner 和 ContentSignerParameters 之前已经废弃，这个版本打上 forRemoval=true 标记 ")],-1);var Q=Object(l["k"])({setup(e){return(e,t)=>(Object(l["r"])(),Object(l["d"])(r["a"],null,{default:Object(l["G"])(()=>[u,c,Object(l["j"])(o["a"],{code:"\n    default boolean isEmpty() {\n      return this.length() == 0;\n    }\n    ",language:"java"}),a,i,s,p,g,Object(l["j"])(o["a"],{code:'\n    package org.example.reflex;\n    import java.util.function.Supplier;\n\n    public class Demo implements Supplier<String> {\n        @Override\n        public String get() {\n            return "hello";\n        }\n    }\n    ',language:"java"}),j,Object(l["j"])(o["a"],{code:'\n    // 加载字节码文件，读取为字节数组\n    final InputStream ins = Demo2.class.getClassLoader().getResourceAsStream("Demo.bytes");\n    final byte[] bytes = ins.readAllBytes();\n\n    // 获取有完整权限的 lookup\n    final MethodHandles.Lookup lookup = MethodHandles.lookup();\n    // 创建隐藏类\n    final MethodHandles.Lookup hiddenClassLookup =\n    lookup.defineHiddenClass(bytes, true, MethodHandles.Lookup.ClassOption.NESTMATE);\n\n    final Class<?> clazz = hiddenClassLookup.lookupClass();\n    // Class::getName 返回的名称里会带有斜杠 /\n    System.out.println(clazz.getName());\n    // 输出 org.example.reflex.Demo/0x0000000800c01880\n    // org.example.reflex.Demo 是隐藏类的全限名称，与正常的类相比多了斜杠及后面部分\n\n    System.out.println(clazz.descriptorString());\n    // 输出 Lorg/example/reflex/Demo.0x0000000800c01880;\n    // 与正常的类相比，多了点号及后面部分\n\n    // 调用 get 方法\n    final Object instance = clazz.getDeclaredConstructor().newInstance();\n    Supplier<String> demo = (Supplier<String>) instance;\n    System.out.println(demo.get());\n\n    // 下面的代码会报错，无法通过反射查找到隐藏类的 method\n    final MethodHandle method = hiddenClassLookup.findVirtual(\n          clazz, "get", MethodType.methodType(void.class));\n    final Object result = method.invokeExact(instance);\n    System.out.println(result);\n    ',language:"java"}),b,O,d,m,h,f,S,y,v,k,M,C,x,A,I,H,_,w,z,D,L,N,P,T,E,R,J,X,F,G,K,U,q,B]),_:1}))}});const V=Q;var W=V;Object(l["c"])(W).mount("#app")}});