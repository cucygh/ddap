## Web客户端广告分发及数据统计

### 在Web业务开发中经常遇到广告加载及管理的问题，举例如下：

- 页面中具有多个广告位，而且每家广告的代码风格和内容不尽相同
- 一个广告位需要投放多家广告，如何在客户端开启A/B测试及动态加载广告代码
- 如何对每个广告进行准确的数据统计（PV、UV、Reffer）
- 如何在引入引用的页面上摒弃杂乱的广告代码

### 需求分析

开发一个广告管理器的模块与业务进行解耦。不管接入广告的数量有多大、A/B测试有多复杂，在开发的视角应该是同意复杂度的，而且与业务是不相关的。当然，开发人员对这些广告的管理也应该是最简单的，需要接近0工作量的才是最好。

管理器应具备以下功能：

- <b>广告配置</b>
	
	即广告内容的定义，每一个广告需要一个唯一的名称来标识。
	
- <b>流量分配</b>

	无论是通过客户端还是服务端来控制流量分配，该API直接输出命中的广告标识。具体的逻辑和实现在内部完成。任何开发可以覆盖该方法实现自己的分配方案。
	
- <b>加载机制</b>

	根据配置动态的加载指定的广告脚本，管理脚本加载和配置的情况。
	
- <b>数据收集</b>

	根据脚本的加载情况，需要将加载信息传递给数据统计平台，比如加载成功、加载失败、安装成功。
	
- <b>数据统计</b>
	
	需要有平台对收集的数据进行统计、分类、展示。
	
### 实现方案

- 使用原生Js进行广告管理模块的开发，不依赖任何第三方Javascript库
- 利用第三方数据平台进行数据收集和统计，如Google Analyze或CNZZ等

### 安装使用

1、安装广告模块管理器
	
``` html
<script src="/lib/ddap.js"></script>
```
	
2、安装第三方数据统计代码
	
``` html
<script src="https://s95.cnzz.com/z_stat.php?id=***&web_id=***"></script>
```
	
3、定义广告
	
``` javascript
<script>
Q.insertAd({
  name: 'tb_side_1',
  scripts: [{
     url: 'http://p.tanx.com/ex?i=mm_32479643_3494618_56760779',
     id: 'tanx-x'
  }]
});
</script>
```

4、安装广告

``` javascript
<script>
document.write('<a style="display:none!important" id="tan-x"></a>');
var Q = window['tt_ddap'] ? window['tt_ddap'].Q : false;
if (Q) {
	var name=Q.transfer();
	Q.start(name);
}
</script>
```

5、数据统计

|广告名称|PV|UV|Reffer|
|-----|-----|-----|------|
|tb\_side_1|1,000|450|查看|
|tb\_side_2|2,000|550|查看|

### 源代码

[查看 Github](https://github.com/cucygh/ddap/blob/master/ddap.js)




