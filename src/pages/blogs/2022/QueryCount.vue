<template>
  <BlogLayoutVue>
    <p>
      Web应用的业务中常常会有分页查询的功能，让用户可以直观的看到匹配记录的数量，自由跳页快速翻看后面的数据。但是分页查询在数据量大和并发量较大时，往往会有比较严重的性能问题，分页查询一般会使用
      select count(*) 求总数，offset 实现跳页，问题常常出在这里。这里结合我遇到的问题，说说 count
      的相关问题。
    </p>
    <h3>count 为什么性能不高？</h3>
    <p>下面是 mysql 官方文档中对于 count 查询的相关说明：</p>
    <blockquote>
      InnoDB does not keep an internal count of rows in a table because concurrent transactions
      might “see” different numbers of rows at the same time. Consequently, SELECT COUNT(*)
      statements only count rows visible to the current transaction. As of MySQL 8.0.13, SELECT
      COUNT(*) FROM tbl_name query performance for InnoDB tables is optimized for single-threaded
      workloads if there are no extra clauses such as WHERE or GROUP BY. InnoDB processes SELECT
      COUNT() statements by traversing the smallest available secondary index unless an index or
      optimizer hint directs the optimizer to use a different index. If a secondary index is not
      present, InnoDB processes SELECT COUNT() statements by scanning the clustered index.
    </blockquote>
    <p>
      存储引擎没有额外存储 count
      信息以方便快速查询的主要原因还是事务并发情况下的考虑，不同的事务读的信息有可能不一致。 对于
      MyISAM 这种不支持事务的引擎则是直接存储一个额外的 count 信息，做到快速获取
    </p>
    <blockquote>
      or MyISAM tables, COUNT(*) is optimized to return very quickly if the SELECT retrieves from
      one table, no other columns are retrieved, and there is no WHERE clause. is optimization only
      applies to MyISAM tables, because an exact row count is stored for this storage engine and can
      be accessed very quickly. COUNT(1) is only subject to the same optimization if the first
      column is defined as NOT NULL.
    </blockquote>
    <p>此外 count(*) 和 count(1) 没有区别，官方文档也有解释。</p>
    <blockquote>
      InnoDB handles SELECT COUNT(*) and SELECT COUNT(1) operations in the same way. There is no
      performance difference.
    </blockquote>
    <p>postgresql 的官方文档中也有关于 count 的说明：</p>
    <blockquote>
      在把count聚集应用到整个表上时，习惯于使用其他 SQL
      数据管理系统的用户可能会对它的性能感到失望。一个如下的查询： SELECT count(*) FROM sometable;
      将会要求与整个表大小成比例的工作：PostgreSQL将需要扫描整个表或者整个包含表中所有行的索引。
    </blockquote>
    <h3>冗余存储 count 信息行不行？</h3>
    <p>
      既然 count
      会扫描整个二级索引或者聚簇索引造成查询效率降低，那么提前存储好总数是不是可以呢？比如冗余存储用户的数量，每增加一个用户，就把数量加1。但是现实中的业务复杂度可能非常变态，有着非常多的筛选项，比如下面这张图展示的电商搜索筛选项。
    </p>
    <p>
      <img
        src="/assets/blogs/2022/query-count/e-commerce-filtering-optioins.png"
        alt="电商平台的过滤选项"
        class="img-fluid"
      />
    </p>
    <p>
      做冗余维护成本很高，各种修改或新增加都要更新数据，在条件非常复杂的情况，要存储各种组合情况下的
      count 才可以做到，所以显然是不可行的。
    </p>
    <h3>不显示总数，只做加载更多</h3>
    <p>
      既然 count 有问题，那不 count
      不就行了？不显示总数也不支持跳页，只给加载更多选项逐页加载，或者滚动到底部自动加载更多，是很多
      app 和网站前台的采用的方案。不过虽然不做 count 查询，offset
      也一样要避免，这样才可以有比较好的性能。offset
      在翻页次数多了以后，也会因为要扫描太多的索引数据，导致查询不效率。
    </p>
    <p>做加载更多时，一般会利用（主键或联合）索引来实现快速定位到数据页开始的位置。</p>
    <CodeHighlight
      code="select * from product order by id asc limit 20;"
      language="sql"
    ></CodeHighlight>
    <p>
      上面是查询第一页的 sql ，由于是按id排序的，在查询第二页的时候，需要将第一页最后一条记录的 id
      作为条件。
    </p>
    <CodeHighlight
      code="select * from product where id>上一页最后一条记录的ID order by id asc limit 20;"
      language="sql"
    ></CodeHighlight>
    <p>
      这样就实现的快速翻页，但是从第二页开始每一页的查询都依赖上一页的查询结果，所以只能逐页加载。
    </p>
    <p>使用联合索引的情况比较复杂，比如结果按照时间排序等情况，这里就不演示了。</p>
    <h3>限制查询结果的不准确分页</h3>
    <p>
      那么，如果必须要有分页信息，但是要求又不高，比如有些业务需要做排行，但是只需要一部分数据，只排前100名，这样只需要能翻几页就可以了。很多电商平台也是这样做的，并不是准确的分页，结果再多，也只能看到前100页的查询结果。
    </p>
    <p>
      <img
        src="/assets/blogs/2022/query-count/pagition.png"
        alt="电商平台的过滤选项"
        class="img-fluid"
      />
    </p>
    <p>这种做法，有效的避免了 count 扫描太多记录的情况，提升了并发能力。</p>
    <CodeHighlight
      code="select count(*) from (select * from product where category=? order by id asc limit 5000);"
      language="sql"
    ></CodeHighlight>
    <p>
      上面是一个简单的示例，不过这个查询还有个问题要注意，就是查询必须得走索引，比如上面示例中，就需要有
      category 和 id 的联合索引，如查询不走索引导致全表扫描，limit
      也就没用了。涉及关键字搜索的，可能还需要使用全文索引。
    </p>
    <h3>数据量大又必须有精确分页的业务需求</h3>
    <p>
      这个就只能靠钱来解决了，采用强大的硬件来支撑或者使用分布式方案，但是不管什么方案，实现高并发的成本都非常高。
    </p>
    <h3>总结</h3>
    <p>
      数据量很小，或者并发量也不大，分页查询还是可以用的，一般情况下框架都自带分页查询功能的，可以很方便的使用，开发效率比较高。真要是数据量大的高并发场景，可能就不得不做一些妥协了，在业务允许的情况下，尽避免
      count 或限制扫描的记录数。
    </p>
  </BlogLayoutVue>
</template>

<script setup lang="ts">
import BlogLayoutVue from '@/components/blog-layout/BlogLayout.vue'
import CodeHighlight from '@/components/CodeHighlight.vue'
</script>
