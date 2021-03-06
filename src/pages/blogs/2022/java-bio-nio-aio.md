如果你经常看编程方面的文章或视频，常常会收到关于同步和阻塞相关的推送或推荐，解释四种组合。
很长一段时间我也搞不明白这些概念，带着这样的疑问，查阅了很多资料。网上有很多文章都是各种打比方，
像排队买饭或是打电话预约等之类的，看了之后我更感觉更懵了。下面来说说我的理解，在这里主要还是解释概念，
然后上代码演示，我相信看代码会比打比方能有更直观的感受。

### 同步（synchronous）和异步（asynchronous）

同步和异步其实就两种不同的编程风格，同步表示必须要等一个步骤执行完成有结果了，才可以执行后面的步骤。

```js
// 同步代码演示
const result1 = step1()
// step1 是同步的，step2 必须要等等 step1 执行完成才可以执行
step2()"
```

同步其实也意味着是**阻塞**的，上面的例子中 step1 执行的时候会阻塞当前线程，如果 step1 执行时间太长，step2 也只能等，必须要顺序执行，我们可以把这个等的过程就是阻塞。

而异步是不需要等待的，一个步骤还没有结果，下一个步骤就可以立即执行，不必按顺序，可以通过回调在未来处理结果。同步的顺序执行更符合人类直觉，而异步常常会很复杂，如果异步需要顺序，每个步骤都需要在上一个步骤的回调中执行，就会产生回调地狱。

```js
// 异步代码演示，step1 不会立即返回结果，在 callback 中可以处理 step1 的结果
step1Async(callback)
// step1 调用后，step2 立刻执行，不需要等待 step1 执行完
step2()"
```

关于同步和异步就说这么多，我觉得还是很好理解的，一般也不会在这里产生困惑。

### BIO（blocking I/O）

BIO 就是阻塞的 IO，相信大家都很熟悉，也非常容易理解。

```java
final FileInputStream fis = new FileInputStream("demo2.zip");
final byte[] bytes = fis.readAllBytes();
System.out.println("文件读取完毕：" + bytes.length + " 字节");
```

上面是 java.io 接口使用 BIO 模式读取文件内容的代码，不多赘述了，接着看 NIO。

### NIO（New Input/Output）

网上有很多文章解释 NIO 是 non-blocking io，这是错的，实际上 NIO 就是新的 io，下面是 Java 官方文档中的说明：

> The Java NIO (New Input/Output) API defines buffers, which are containers for data, and other structures and mechanisms to support buffers.

NIO 中大部分操作仍然是阻塞的，只有 SelectableChannel 支持多路复用，可以实现无阻塞。所以，NIO 大部分 API 也是 BIO 。

> Multiplexed, non-blocking I/O: Multiplexing is the ability to process multiple I/O operationsin one channel. Selectable channels support this. A selectable channel can be put into blocking or non-blocking mode. In blocking mode, every I/O operation invoked upon the channel will block until it completes. In non-blocking mode, an I/O operation will never block and may transfer fewer bytes than were requested or possibly no bytes at all. See the SelectableChannel class.

#### NIO 中的 BIO 例子，使用 channel 读取文件

下面是一个简单的例子，使用 nio 读取文件内容，仍然是阻塞的。

```java
final Path path = Paths.get("demo2.zip");
final FileChannel fc = FileChannel.open(path);
final ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
int length;
long totalBytes = 0L;
while ((length = fc.read(byteBuffer)) != -1) {
  totalBytes += length;
  byteBuffer.clear();
}
System.out.println("文件的大小是 ：" + totalBytes + " 字节");
```

为了减少代码量，我省略了读取文件内容的过程，只统计了字节总数。我看到外网有些博客把这个读取文件例子说成是 synchronous non blocking，我认为是不对的。看了这段代码，相信你和我会是一样的感觉：这和同步阻塞有什么区别？其实这就是同步阻塞的。

#### NIO 无阻塞（non blocking）例子

下面是一个 Java 官方文档中给的例子，无阻塞时间服务，每当有客户端连接就向客户端打印当前的时间。我做了些精简，然后又加了一些中文注释。

```java
// Selector for incoming time requests
Selector acceptSelector = SelectorProvider.provider().openSelector();
// Create a new server socket and set to non blocking mode
// ServerSocketChannel 实现了 SelectableChannel,支持无阻塞
ServerSocketChannel ssc = ServerSocketChannel.open();
// 设置为无阻塞模式
ssc.configureBlocking(false);
// Bind the server socket to the local host and port
InetAddress lh = InetAddress.getLocalHost();
InetSocketAddress isa = new InetSocketAddress(lh, port);
ssc.socket().bind(isa);

// Register accepts on the server socket with the selector. This
// step tells the selector that the socket wants to be put on the
// ready list when accept operations occur, so allowing multiplexed
// non-blocking I/O to take place.
// 注册感兴趣的 key: OP_ACCEPT ，当 OP_ACCEPT 操作发生时，
// 会在下次的 selection operation 中看到（下面的 acceptSelector.select() ）
SelectionKey acceptKey = ssc.register(acceptSelector, SelectionKey.OP_ACCEPT);
System.out.println(acceptKey);

// Here's where everything happens. The select method will
// return when any operations registered above have occurred, the
// thread has been interrupted, etc.
// select() 执行一个阻塞的 selection operation ，直到下面的其中一种情况发生：
// 1. 至少有一个 channel 被选择
// 2. 当前 selector 实例 的 wakeup 方法被调用
// 3. 当前线程被中断
// 这里 selector 会一直阻塞，直到 ssc （ServerSocketChannel）准备接受连接（前面注册了 OP_ACCEPT）
// while 的条件是 acceptSelector.select() > 0，只要不发生 2 和 3 的情况，循环就会一直进行下去
while (acceptSelector.select() > 0) {
  // Someone is ready for I/O, get the ready keys
  Set<SelectionKey> readyKeys = acceptSelector.selectedKeys();
  Iterator<SelectionKey> i = readyKeys.iterator();
  System.out.println("while2");
  // Walk through the ready keys collection and process date requests.
  while (i.hasNext()) {
    SelectionKey sk = i.next();
    i.remove();
    // The key indexes into the selector so you
    // can retrieve the socket that's ready for I/O
    ServerSocketChannel nextReady = (ServerSocketChannel) sk.channel();
    // Accept the date request and send back the date string
    Socket s = nextReady.accept().socket();
    // Write the current time to the socket
    PrintWriter out = new PrintWriter(s.getOutputStream(), true);
    Date now = new Date();
    out.println(now);
    out.close();
  }
}
```

上面就是一个同步无阻塞的例子，写的仍然是同步代码，我们能够明显感受到是通过 configureBlocking() 设置了无阻塞模式，然后就是代码比较复杂，有点绕（费脑）。
**实际上这里的无阻塞指的是可以做到一个线程处理多个连接**
，不必一个请求处理完才可以处理下一个请求，这样相比一个线程只能处理一个请求的模式，就不容易因为请求太多而造成阻塞，提升了吞吐量。或者可以认为无阻塞是请求无阻塞，这样可能更好理解，一般说到同步无阻塞都是说的连接处理，其它方面的例子我还没有见到。

编写一个客户端程序来验证下，连接服务，打印接收到的内容，然后退出。

```java
final InetAddress lh = InetAddress.getLocalHost();
final Socket socket = new Socket(lh.getHostAddress(), port);
final InputStream in = socket.getInputStream();
final byte[] bytes = in.readAllBytes();
System.out.println(new String(bytes));"
```

上面的代码每次运行，都会打印出当前的时间。通过调试可以发现服务器端代码走到
acceptSelector.select() 就会阻塞不再继续，每次客户端建立连接，acceptSelector.select()
就会返回结果，进入循环中，处理完又继续阻塞等待。

### AIO（asynchronous IO）

Java 中的 AIO 实际上也属于 NIO ，在 java.nio 这个包下，使用上只是略有区别，创建异步的 channel 即可。

```java
final Path path = Paths.get("demo2.zip");
final AsynchronousFileChannel fc = AsynchronousFileChannel.open(path);
final ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
long totalBytes = 0L;
long offset = 0;
while (true) {
  final Future<Integer> future = fc.read(byteBuffer, offset);
  // 读取返回的是一个异步结果，不会阻塞，下面的代码会立即执行，而不必等待
  System.out.println("do something ... ");
  // 调用 future 的 get() 等待异步完成返回结果，再继续后面的逻辑
  int length = future.get();
  if (length == -1) {
    break;
  }
  offset += length;
  totalBytes += length;
  byteBuffer.clear();
}
System.out.println("文件的大小是 ：" + totalBytes + " 字节");
```

这段代码和前面的使用 channel 读取文件的例子作用是一样的，不同的是使用了
AsynchronousFileChannel，读取内容返回的是 Future 对象来表示异步结果。代码中调用了 get()
方法在当前线程等待异步操作完成返回结果，get() 是阻塞的，直到异步完成或发生异常，相当于 es6
中的 await ，在 Java 中使用 Future 可以以同步的方式来写异步代码，避免写出非常复杂的回调。Future
在安卓程序的开发中比较常用，由于安卓只允许在主线程中渲染 UI，所以可以将一些异步操作（http
请求等）封装成 Future 对象返回，然后在主线程中等待所有的异步操作完成，拿到结果后再进行渲染。

### 总结

文章开头说了常常会有四种 IO 模式的区分的问题，有些面试题可能会问，但是本文的代码只演示了三种模式，
实现是不存在异步阻塞模式的，只有三种模式，想想看，在异步中的代码不管是怎么写的，对于调用处来说都是无阻塞的。

感谢你能看到这，写了这么多，希望能对你有用。