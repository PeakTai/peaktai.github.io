由于之前有段时间 idea 总不稳定，卡顿还闪退，我便开始考虑使用 vscode 来做 Java 开发。
vscode 用了几个月，下面来分享下我的使用感受。

### 插件

idea 是开箱即用的，基本上不需要装什么插件。vscode 我安装了微软开发的 Extension Pack for Java 和 Spring Initializr Java Support，
还有红帽公司开发的 Language Support for Java(TM) by Red Hat ，以及其它诸如 Java IDE 等一些 Java 辅助插件。
Language Support for Java(TM) by Red Hat 支持设置多个版本的 jdk ，可以根据 pom.xml 文件中的项目属性自动识别
并使用相应的版本。安装上这些插件之后，基本上够用了。

```xml
<properties>
  <java.version>17</java.version>
</properties>
```

### 项目打开速度

这里不得不说 idea 打开项目有时候真的很慢，一个 loading 横在中间要很久，如果首次打开还会有创建索引的任务启动。
多说一句，Android Studio 和 idea 不愧是一脉相承，我经常遇到等半天才出来的。当然，有可能是我的机器配置低，但是同样配置 vscode
就快得多了，我使用下来感觉稳定性也比 idea 高，极少有闪退的。

当然虽然 vscode 打开项目很快，但是也免不了后后台走任务来分析 Java 项目，在分析没有完成之前，很多功能还用不了。

![opening java projects](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-opening-java-projects.png)

但是，至少代码有高亮，查看和编写代码都是可以的，虽然分析没有完成前可能缺少代码提示。如果只是查看自己下载的开源项目代码进行学习，
vscode 就方便多了。

### 项目展示

idea 不同类型的目录使用不同的颜色，比较醒目，配色也比很舒服。

![项目视图对比](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/project-view.png)

上图两个编辑器都是在默认的浅色主题下的的项目文件浏览截图对比，idea 确实要更好一些。vscode 的 java 插件会提供一个 JAVA PROJECTS 的
文件管理器扩展，但是效果不是很好，我不是很喜欢用，基本上还是使用默认。

![vscode explorer java projects](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-java-project-explorer.png)

### 变量申明

在这方面 idea 可以说非常懂的 Java 开发者，在 Java 10 之前的版本，不支持类型自动推断，必须要在申明变量时写上变量的具体类型，
idea 在后面打上 `.var` 根据提示就可以自动生成变量。并且在建议的列表中选择变量名称后按回车，光标会自动移动到
语句结尾处的分号后面，再次按回车键开始编写下一条语句，非常的高效。

![idea create local variable](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-create-local-variable.png)

vscode 则就差点意思了，你必须要把变量名写出来，才可以给你自动创建变量。

![vscode create variable](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-create-variable.png)

并且插件不太稳定插件，有时候会报错无法完成创建，更新过几个版本后仍然存在这个问题，下面是我重现后在控制台的截图，插件有报错。

![vscode-redhat-java-error](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-redhat-java-error.png)

在这方面 idea 确实更顺滑，效率要高不少。

### 代码生成和补全

idea 没有自定义代码片段的功能，但是自带了很多 java 的代码片段，基本上也够用了。

![idea code completion](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-code-completion.png)

vscode 是支持自定义代码片段了，java 相关的插件自带的片段比较的少，为了和 idea 体验一致，我自定义了一些。

Idea 还有 soutv 和 fori 这类快捷补全操作，可以根据当前代码生成一段代码的功能，智能联动修改，这是我比较常用的。vscode 就没有这么智能了，
虽然也有 fori ，但仅仅是代码片段，能够输出一段代码而已，得在生成的代码基础上进行修改。

vscode 和 idea 都支持右键菜单进入关联的测试类，当关联的测试类不存在的情况下，可选择创建测试类，
自动在 maven 的 test 目录下生成相应的包的测试类。

### 查看类的结构

vscode 通过左侧的 outline 视图可以查看类的结构，功能比较简洁。在一个类行数较多的情况下，可用于快速定位的具体方法的代码。

![vscode outline](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-outline.png)

Idea 的功能则要丰富一些，支持查看继承的方法和属性。

![idea structure](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-structure.png)

### 引用查看

在调试程序和查阅源码的时候，我们常常需要查看类的引用（用法），看看有哪些地方使用过。在这方面 vscode 的功能
就要简陋一些，但是 Idea 会做好分类，查看起来非常的方便。

![reference and usage](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/reference-and-usage.png)

上图左边是 vscode 的 references 视图，右边是 Idea 的用法查看窗口。

### 关系图

idea 的旗舰版支持查看类的图表，通过图表可以清晰的了解类的继承关系，对于查看一些关联非常复杂的项目的代码还是很有帮助的。
vscode 我目前安装了插件后没有这个功能，不知道有没有插件可以实现。

![AbstractApplicationContext-diagramming](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/AbstractApplicationContext-diagram.png)

### 调试

调试方面，基本上没有什么差别。Idea 有的功能，vscode 也都有，像表达式计算、为断点设置条件、栈信息等一个不少。

![vscode breakpoint edit](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-breakpoint-edit.png)

### 代码分析

Idea 有自带的代码分析功能，就我目前装的 vscode 插件是没有这个功能的。

![idae code analysis](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-code-analysis.png)

不过虽然这个功能很强大，我基本上不用的，一般都是项目中集成 spotbugs 之类的插件来做检查，
在 CI 时自动去执行。在 git 做提交时 Idea 也会提醒你代码有警告或错误之类的，为了速度能快一些，
我都是关掉的，否则就可能要看很长时间的 loading。

### 对 maven 的支持

安装了插件的 vscode 也提供了 maven 视图，但是体验不是太好，当你要查看插件的时候才去加载插件信息，loading 状态有时候会持续很久，
等的人着急，这还不算完，打开了插件列表，查看插件的 goal 一点击又要加载很久。

![vscode maven plugin loading](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-maven-plugin-loading.png)

查看依赖也都是一样，有很长时间的加载过程。

Idea 会先做加载信息做好索引，要查看的时候直接点开，效率多了。并且 Idea 的 maven 相关功能也非常丰富。依赖分析功能可以非常直观的
查看包依赖情况。

![idea dependencies analysis](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-maven-dependencies-analysis.png)

执行 maven 目标功能还可以列出所有的 goal ，并且可以搜索。

![idea maven execute goals](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-maven-exec-goals.png)

此外还有跳过测试功能也是常用的，开发的时候非常方便，在 vscode 中就麻烦一些了，需要打命令来执行。

在对 maven 的支持上，vscode 的体验不是很好，加载等待太浪费时间了，Idea 在效率上完胜。

### 对 Spring 的支持

vscode 插件 Spring Boot Dashboard 我是从来没有打开过控制台的，一直报错，也曾寻找过一些方法看能不能解决，
可以从网上找到的相关信息极少，源码仓库也有很多人发 issue 说打不开，永远在加载等问题，但是都没有很好的解决。
在 [issus](https://github.com/microsoft/vscode-spring-boot-dashboard/issues)中看到有人回退 vscode 
的版本解决问题了，不过我想还是算了，不愿意折腾，不能用就不能用吧，其实影响不大。

Idea 旗舰版自带了 Spring 支持，可以查看容器中的 Bean 和 mvc 端点，对于大项目在开发中用来快速定位代码还是很有用的。

![Idea Spring Dashboard](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-spring-dashboard.png)

Idea 旗舰版还支持 applications 配置文件自动提示实例，可以通过属性名称跳转到对应的 Properties 类源代码。
这样写配置的时候更快更稳，不需要一边看文档一边写了。

![idea spring config](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-spring-config.png)

安装了插件后的 vscode 也具体配置文件自动提示的功能，可以通过点击属性进入源码，功能上和 Idea 没有差别。

![vscode spring config](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-spring-config.png)

vscode 和 Idea 旗舰版都有 Spring initializr 可用于快速创建一个 spring boot 项目，使用方法上略有不同，Idea 中创建新项目，在选单中就可以
选择 Spring initializr，vscode 则需要在命令面板中调出 Spring initializr。

![vscode spring initializr](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-spring-initializer.png)

Idea 对 Sring 的支持仅限于旗舰版，社区版没有以上的功能。

### 对 JPA 的支持

Idea 旗舰版提供了数据管理功能，对 JPA 做了关联支持，可以让项目关联数据源。如果 JPA 中配置的字段在数据源中
不存在，还会有报错。Idea 还自带了 Entity 生成功能。不过这些功能我目前没有在用了，pgadmin 和 mysql workbench 比 idea 集成的好用多了，项目一多配置起来很麻烦。生成 Entity 其实还好，工作量并没有那么大。

Idea 旗舰版支持 Spring Jpa 仓库代码的查询方法自动补全，非常的方便高效，比手写放心多了。

![idea-jpa-repository-suggestion](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-jpa-repository-suggestion.png)

如果你需要写 jpql ，idea 旗舰版还会有代码高亮和提示功能，帮助你更高效的编写 jpql 。

![idea-jpql-suggestion](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/idea-jpql-suggestion.png)

上图是 Repository 类中的代码建议，在其它的地方，如果你使用 EntityManager.createQuery() ，相关的
jpql 字符串也会有高亮和提示补全，非常的智能。

vscode 在安装了 spring 插件之后，也有查询方法自动生成的功能。

![vscode-jpa-query-method-suggestion](/assets/blogs/2022/java-development-comparison-between-vscode-and-idea/vscode-jpa-query-method-suggestion.png)

不过是以代码片段的形式来直接生成一段代码，后续的操作没有提示，体验上和 idea 差远了，idea 支持连续输入生成一个较为复杂的查询方法。
比如要写 findByNicknameAndAge()，输入 findByNickname 后，再输入 And ，此时 idea 又开始提示其它的字段了，可以再次帮你自动补全，
可以方便的写出条件较多的 QueryMethod 。而 vscode 帮你生成完 findByNickname 就结束了，不支持继续添加 And 条件继续提示，
也不能生成 Top 和 LessThan 等 QueryMethod 支持的关键字。

不过这些功能仅限于 Idea 旗舰版，社区版是没有这些功能的。

### 总结

vscode 做 Java 开发的体验确定不如 Idea 旗舰版，不过和社区版相比互有优势，也还算过得去。
如果要求不高的话，我觉得 Idea 社区版够用了，对 Spring 和 JPA 的辅助功能没有的话也还好，不能算是刚需，
部分旗舰版才有的功能，vscode 也有，可以临时切换 vscode 来解决，互补着用。
