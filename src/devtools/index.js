import React from "react";
import { Button, Grid, Input, Tab, Dialog, Icon, Table, SearchForm, DatePicker, Select, Feedback} from "@alife/hippo";
import "@alife/hippo/dist/hippo.css";
import "../css/devtools.css";
import "@alife/hippo-page-layout/lib/index.scss";
import request from '@royjs/core/request';
const { Combobox, Option  } = Select;
const { Group: InputGroup } = Input;
const {toast} = Feedback;
const onSelect = (...args) => {
  console.log(...args);
};
var bg = {};
if (chrome.extension) {
  bg = chrome.extension.getBackgroundPage();
}
const portalHost = location.host === 'www.hemaos.com'
                    ? 'www.hemaos.com' : 'portal.hemaos.com';
const DomainMap = {
  item: 'item.hemaos.com',
  scm: 'scm.hemaos.com',
  // ticket: portalHost, // ticket.hemaos.com 因为ticket暂未申请公网VIP
  ums: 'ums.hemaos.com',
  // portal: portalHost,
  admin: 'admin.hemaos.com',
  market: 'market.hemaos.com',
  data: 'data.hemaos.com',
  finance: 'finance.hemaos.com',
  homs: 'homs.hemaos.com',
  bom: 'bom.hemaos.com',
  supplier: 'supplier.hemaos.com',
  homsTmall: 'wdkmiddle.hemaos.com', // homs.cbbs.tmall.com
  rbacTmall: 'rbac.cbbs.tmall.com', // 请不要用HTTP调用！！！
  settlement: 'settlement.hemaos.com',
  infrastructure: 'infrastructure.hemaos.com', // 基础资料
  local: 'local.hemaos.com',
  resource: 'alpha.hemaos.com', // 资源位投放项目 后端api地址
  ddy: 'ddy.hemaos.com', // 拉新地图投放项目  士元
  midway: 'midway.hemaos.com', // 拉新地图投放项目  禹力
  flow: 'flow.hemaos.com', // 商品中心二期流程中心接口
  shequ: 'shequ.hemaos.com', // 社区CRM微信 @安浙
  contract: 'contract.hemaos.com', // 合同（新）
  rap2api: 'rap2api.alibaba-inc.com',
  ics: 'ics.hemaos.com', // 采配调
  fe: 'fe.hemaos.com', // 前端 @安浙
  'auto-setup': 'auto-setup.hemaos.com', // AutoSetup
  conveyor: 'conveyor.hemaos.com', // 悬挂链
};
function getRelativeUrl (url) {
  if (url instanceof RegExp) {
    return url
  }
  if (!url) {
    return ''
  }
  if (url.indexOf('http://') > -1) {
    url = url.substring(url.indexOf('/', 7) + 1)
  } else if (url.indexOf('https://') > -1) {
    url = url.substring(url.indexOf('/', 8) + 1)
  }
  if (url.charAt(0) !== '/') {
    url = '/' + url
  }
  return url
}
function getRelativeUrl2 (url) {
  if (url instanceof RegExp) {
    return url
  }
  if (!url) {
    return ''
  }
  if (url.indexOf('http://') > -1) {
    url = url.substring(0,7)
  } else if (url.indexOf('https://') > -1) {
    url = url.substring(0,8)
  }
  return url
}
function getRelativeUrl3 (url) {
  if (url instanceof RegExp) {
    return url
  }
  if (!url) {
    return ''
  }
  if (url.indexOf('http://') > -1) {
    url = url.substring(7,url.indexOf('/', 7))
  } else if (url.indexOf('https://') > -1) {
    url = url.substring(8,url.indexOf('/', 8))
  }
  return url
}
const TabPane = Tab.TabPane;
class Devtools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      title: '',
      $scope: {
        curRule: {},
        inputError: "",
        maps: bg.ReResMap || []
      },
      show: "none",
      type: 1,
      modules: [],
      visible: false,
      visible1:false,
      mapsList: [],
      organization: [],
      repositoryListId:'',
      defauleResOc:'rap2api.alibaba-inc.com',
      defauleResMe:'http://',
      defauleReqOc:'ums.hemaos.com',
      defauleReqMe:'http://',
      defauleApp: '/app/mock/',
      resValueMe:'http://',
      resValueOc:'rap2api.alibaba-inc.com',
      reqValueOc:'ums.hemaos.com ',
      reqValueMe:'http://',
      dataSelct: [],
      index:0,
      dataSource: [
        {
            component: Combobox,
            attributes: {
                label: '团队',
                name: 'value1',
                placeholder: '请选择团队名称或者Id',
                required:true,
                requiredMessage: '请选择团队名称或者Id',
                tipAlign: 'tr',
                onInputUpdate:this.organizationList.bind(this)
            }
        },
        {
            component: Combobox,
            attributes: {
                label: '仓库',
                name: 'value2',
                placeholder: '请输入仓库名称或者Id',
                required:true,
                requiredMessage:'请输入仓库名称或者Id',
                onInputUpdate:this.repositoryListUpdate.bind(this)
            }
        }
        // {
        //     component: Combobox,
        //     attributes: {
        //         label: '模块',
        //         name: 'value3',
        //         placeholder: '请输入模块',
        //         tipMessage: '请输入模块',
        //     }
        // }
    ]
    };
  }
  organizationList(name){
    
    request.get(`http://rap2api.alibaba-inc.com/organization/list?name=${name}&cursor=1&limit=100`).then((res)=>{
      this.getComboboxData(0,this.arrayLabelValue(res.data))
   }).catch((err) => {
     console.log(err);
   })
  }
  onChangeFrom(name,value,item){
    if(name === 'value1'){
      this.onCahngeList(value);
      this.getComboboxValue(0,value);
      this.getComboboxValue(1,'');
    }else if(name === 'value2'){
      this.repositoryGet(value);
     this.getComboboxValue(1,value);
    }else if(name === 'value3'){
      console.log(name,value)
    }
    this.setState({
      [name]:value
    })
    
    
  }
  onCahngeList(id){
    request.get(`http://rap2api.alibaba-inc.com/organization/get?id=${id}`).then((res)=>{
     // this.getComboboxData(0,this.arrayLabelValue(res.data))
   })
   this.repositoryList({name:'',id});
   this.setState({
     repositoryListId:id
   })
  }
  repositoryListUpdate(value){
    this.repositoryList({name:value,id:this.state.repositoryListId})
  }
  repositoryList({name,id}){
    request.get(`http://rap2api.alibaba-inc.com/repository/list?user=&organization=${id}&name=${name}&cursor=1&limit=100`).then((res)=>{
      this.getComboboxData(1,this.arrayLabelValue(res.data))
      
    })
  }
  repositoryGet(id){
    toast.loading({
      content:'正在加载',
      hasMask:true
    })
    request.get(`http://rap2api.alibaba-inc.com/repository/get?id=${id}`).then((res)=>{
     // this.getComboboxData(2,this.arrayLabelValue(res.data.modules));
      let data = [];
      res.data.modules.map((item) => {
       
        if(item.interfaces){
         data =  data.concat(item.interfaces);
        }
      });
      this.setState({
        modules:data
      },()=> {
        toast.hide();
      })
    })
  }

  
  saveRule() {
    let $scope = this.state.$scope;
    if (this.virify()) {
      if (this.state.type === 1) {
        let defauleApp = this.state.defauleApp;
        let value2 = this.state.value2 || '';
        let curRule = {
          res:`${this.state.defauleResMe}${this.state.defauleResOc}${defauleApp}${value2}${$scope.curRule.res}`,
          req:`${this.state.defauleReqMe}${this.state.defauleReqOc}/${$scope.curRule.req}`
        }
        curRule.checked = true;

        $scope.maps.push(curRule);
      }
      toast.success('保存成功');
      this.setState({
        $scope,
        visible: false
      });
      bg.localStorage.ReResMap = JSON.stringify($scope.maps);
    } else {
      toast.error($scope.inputError);

    }
  }
  saveRule1() {
    let $scope = this.state.$scope;
    console.log(this.state)
    if (this.virify()) {
      if (this.state.type === 1) {
        
        let defauleApp = this.state.defauleApp;
        let value2 = this.state.value2 || '';
        let curRule = {
          res:`${this.state.resValueMe}${this.state.resValueOc}/${$scope.curRule.res}`,
          req:`${this.state.resValueMe}${this.state.reqValueOc}/${$scope.curRule.req}`
        }
        curRule.checked = true;

        $scope.maps.push(curRule);
      } else {
        let curRule = {
          res:`${this.state.resValueMe}${this.state.resValueOc}/${$scope.curRule.res}`,
          req:`${this.state.resValueMe}${this.state.reqValueOc}/${$scope.curRule.req}`
        }
        $scope.maps[this.state.index]=curRule;
        
      }
      toast.success('保存成功');
      this.setState({
        $scope,
        visible1: false
      });
      bg.localStorage.ReResMap = JSON.stringify($scope.maps);
    } else {
      toast.error($scope.inputError);

    }
  }
  arrayLabelValue(array){
    let nextArray = [];
    nextArray= array.map((item)=>{
      let obj = item;
      obj.label = item.name
      obj.value = item.id
      return obj
    })
    return nextArray;
  }
  componentWillMount(){
   let imgs = document.getElementsByTagName('img');
   for(var i=0; imgs.length>i;i++){
     let arrSrc = `http${imgs[i].getAttribute('src')}` ;
      imgs[i].setAttribute('src',arrSrc);
      console.dir(imgs[i].getAttribute('src'))
   }
   let data = [];
   for(var i in DomainMap){
    data.push(DomainMap[i]);
   }
   this.setState({
    dataSelct:data
   })
   this.organizationList('')
  //  location.href = 'http://rap2.alibaba-inc.com/repository'
  // request.get('http://rap2.alibaba-inc.com/account/info')
   
   
  }
  getComboboxData(index,data) {
    let dataSource = this.state.dataSource;
    dataSource[index].attributes.dataSource = data
    this.setState({dataSource});
}
getComboboxValue(index,data) {
  let dataSource = this.state.dataSource;
  dataSource[index].attributes.value = data
  this.setState({dataSource});
}
  onChange(name, value) {
    let $scope = this.state.$scope;
    $scope.curRule[name] = value;
    this.setState({
      $scope: $scope
    });
  }
  
  cellUrl(value,index,item){
    let url = `${this.state.defauleResMe}${this.state.defauleResOc}${this.state.defauleApp}${this.state.value2}${getRelativeUrl(value)}`  ;
    return  (<a target='_blank' href={url}>{value}</a>)
  }
  virify() {
    let $scope = this.state.$scope;
    if (!$scope.curRule.req || !$scope.curRule.res) {
      $scope.inputError = "请输入正确的地址";
      return false;
    }
    try {
      new RegExp($scope.curRule.req);
    } catch (e) {
      $scope.inputError = "req正则格式错误";
      return false;
    }
    $scope.inputError = "";
    return true;
  }
  add(status) {
    let show = this.state.show;
    let $scope = this.state.$scope;
    $scope.curRule = {
      req: "",
      res: ""
    };
    let resValueMe =  'http://'
    let reqValueMe =  'http://'
    let resValueOc =  'rap2api.alibaba-inc.com'
    let reqValueOc =  'ums.hemaos.com'
    this.setState({
      show: status,
      $scope,
      type: 1,
      visible1: true,
      title:'新增',
      resValueMe,
      reqValueMe,
      resValueOc,
      reqValueOc
    });
  }
  addProxy(value,status) {
    let show = this.state.show;
    let nextValue = getRelativeUrl(value);
    let $scope = this.state.$scope;
    $scope.curRule = {
      req: null,
      res: nextValue
    };
    this.setState({
      show: status,
      $scope,
      type: 1,
      visible: true
      
    });
  }
  edit(curRule,index) {
    let $scope = this.state.$scope;
    let str = JSON.stringify(curRule);
    let obj = JSON.parse(str);
    let curRules = {} ;
    curRules.res = getRelativeUrl(obj.res);
    curRules.req = getRelativeUrl(obj.req);
    curRules.checked = obj.checked;
    let resValueMe =  getRelativeUrl2(obj.res)
    let reqValueMe =  getRelativeUrl2(obj.req)
    let resValueOc =  getRelativeUrl3(obj.res)
    let reqValueOc =  getRelativeUrl3(obj.req)
      //  console.log(getRelativeUrl2(obj.req));
      //  obj.resValueMe = getRelativeUrl2(obj.req);
      //  obj.resValueMe = getRelativeUrl2(obj.req);
      //  obj.resValueOc = getRelativeUrl(obj.req);
      //  obj.reqValueOc = getRelativeUrl(obj.req);

       
    $scope.curRule = curRules;

    this.setState({
      $scope,
      visible1: true,
      type: 2,
      title:'编辑',
      index,
      resValueMe,
      reqValueMe,
      resValueOc,
      reqValueOc
    });
  }
  checked(value, index) {
    let $scope = this.state.$scope;
    $scope.maps[index].checked = value;
    this.setState({
      $scope
    });
    bg.localStorage.ReResMap = JSON.stringify($scope.maps);
  }
  cell(value, index, item) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary  next-btn-primary btn-xs edit"
          onClick={this.edit.bind(this, item,index)}
        >
          编辑{" "}
        </button>
        &nbsp;
        <button
          type="button"
          className="btn btn-default btn-xs remove"
          onClick={this.remove.bind(this, item)}
        >
          删除{" "}
        </button>
      </div>
    );
  }

  addProxyRender(value){
    return (
      <Button
        size="small"
        onClick={this.addProxy.bind(this, value,true)}
        type="primary"
      >
        <Icon type="add" />
           添加规则
      </Button>
    )
  }
  cellChecked(value, index, item) {
    return (
      <input
        type="checkbox"
        checked={item.checked}
        onChange={this.checked.bind(this, !item.checked, index)}
      />
    );
  }
  remove(rule) {
    let $scope = this.state.$scope;
    for (var i = 0, len = $scope.maps.length; i < len; i++) {
      if ($scope.maps[i] === rule) {
        $scope.maps.splice(i, 1);
      }
    }
    toast.success('删除成功');
    this.setState({
      $scope
    });
    bg.localStorage.ReResMap = JSON.stringify($scope.maps);
    
  }

  onSearch(){
    toast.loading('正在加载中');
    this.setState({
      mapsList:this.state.modules
    },()=> {
      toast.hide()
    })
  }
  render() {
    let $scope = this.state.$scope;
    let { maps } = $scope;
    let show = this.state.show;
    let mapsList = this.state.mapsList;
    let dataSelct = this.state.dataSelct;
    let modules = this.state.modules;
    return (
      <div>
        <div>
          <div className="demo-col-inset" />
          <Tab triggerType="click"  > 
            <TabPane closeable={true} key={1} tab={"添加规则"}>
              <Button
                size="small"
                onClick={this.add.bind(this, true)}
                type="primary"
              >
                <Icon type="add" />
                添加规则
              </Button>
              
              <Dialog
                onCancel={() => {
                  this.setState({ visible: false });
                }}
                onOk={this.saveRule.bind(this)}
                onClose={() => {
                  this.setState({ visible: false });
                }}
                title={this.state.title}
                visible={this.state.visible}
              >
                <div className="customize-limit">
                  <div className="form-group" style={{ marginBottom: 5 }}>
                    <label>Replaced URL</label>
                    <div>
                    <InputGroup>
                    <Select style={{width:30}}  defaultValue={this.state.defauleReqMe}  disabled>
                        <Option  value={'http'}>http://</Option>
                        <Option  value={'https'}>https://</Option>
                        <Option  value={'ws'}>ws://</Option>
                        <Option  value={'wss'}>wss://</Option>
                      </Select>
                      <Select style={{width:180}}  defaultValue={this.state.defauleReqOc}  disabled>
                        {/* <Option value="orderNumber">运单号</Option> */}
                        
                        {dataSelct.map((item,index)=>{
                          return (
                            <Option  key={index} value={item}>{item}</Option>
                          )
                        })}
                      </Select>
                      <Input
                        type="text"
                        placeholder="请输入地址"
                        onChange={this.onChange.bind(this, "req")}
                        value={$scope.curRule.req}
                        style={{width:280}}
                      />
                    </InputGroup>
                     
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 5 }}>
                    <label>Matched URL</label>
                    <div>
                    <InputGroup>
                    <Select style={{width:30}}  defaultValue={this.state.defauleResMe}   disabled>
                        <Option  value={'http://'}>http://</Option>
                        <Option  value={'https://'}>https://</Option>
                        <Option  value={'ws://'}>ws://</Option>
                        <Option  value={'wss://'}>wss://</Option>
                      </Select>
                      <Select style={{width:180}}  defaultValue={this.state.defauleResOc} disabled>
                        {/* <Option value="orderNumber">运单号</Option> */}
                        
                        {dataSelct.map((item,index)=>{
                          return (
                            <Option  key={index} value={item}>{item}</Option>
                          )
                        })}
                      </Select>
                      <Input style={{width:280}}
                        type="text"
                        placeholder="请输入地址"
                        onChange={this.onChange.bind(this, "res")}
                        value={$scope.curRule.res}
                      />
                    </InputGroup>
                      
                    </div>
                  </div>
                </div>
              </Dialog>
              <Dialog
                onCancel={() => {
                  this.setState({ visible1: false });
                }}
                onOk={this.saveRule1.bind(this)}
                onClose={() => {
                  this.setState({ visible1: false });
                }}
                title={this.state.title}
                visible={this.state.visible1}
              >
                <div className="customize-limit">
                  <div className="form-group" style={{ marginBottom: 5 }}>
                    <label>Replaced URL</label>
                    <div>
                    <InputGroup>
                    <Select style={{width:30}}  defaultValue={this.state.defauleReqMe} onChange={this.onChangeFrom.bind(this,'reqValueMe')} value={this.state.reqValueMe}> 
                        <Option  value={'http://'}>http://</Option>
                        <Option  value={'https://'}>https://</Option>
                        {/* <Option  value={'ws'}>ws://</Option>
                        <Option  value={'wss'}>wss://</Option> */}
                      </Select>
                      <Select style={{width:180}}  defaultValue={this.state.defauleReqOc}  onChange={this.onChangeFrom.bind(this,'reqValueOc')} value={this.state.reqValueOc}>
                        {/* <Option value="orderNumber">运单号</Option> */}
                        
                        {dataSelct.map((item,index)=>{
                          return (
                            <Option  key={index} value={item}>{item}</Option>
                          )
                        })}
                      </Select>
                      <Input
                        type="text"
                        placeholder="请输入地址"
                        onChange={this.onChange.bind(this, "req")}
                        value={$scope.curRule.req}
                        style={{width:280}}
                      />
                    </InputGroup>
                     
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 5 }}>
                    <label>Matched URL</label>
                    <div>
                    <InputGroup>
                    <Select style={{width:30}} onChange={this.onChangeFrom.bind(this,'resValueMe')} value={this.state.resValueMe} >
                        <Option  value={'http://'}>http://</Option>
                        <Option  value={'https://'}>https://</Option>
                        {/* <Option  value={'ws'}>ws://</Option>
                        <Option  value={'wss'}>wss://</Option> */}
                      </Select>
                      <Select style={{width:180}} onChange={this.onChangeFrom.bind(this,'resValueOc')} value={this.state.resValueOc}>
                        {/* <Option value="orderNumber">运单号</Option> */}
                        
                        {dataSelct.map((item,index)=>{
                          return (
                            <Option  key={index} value={item}>{item}</Option>
                          )
                        })}
                      </Select>
                      <Input style={{width:280}}
                        type="text"
                        placeholder="请输入地址"
                        onChange={this.onChange.bind(this, "res")}
                        value={$scope.curRule.res}
                      />
                    </InputGroup>
                      
                    </div>
                  </div>
                </div>
              </Dialog>
              <div style={{ marginTop: 10 }}>
                <Table dataSource={maps} optimization={false}>
                  <Table.Column
                    dataIndex="req"
                    width={90}
                    cell={this.cellChecked.bind(this)}
                    title="是/否代理"
                  />
                  <Table.Column dataIndex="req" title="Replaced URL" />
                  <Table.Column dataIndex="res" title="Matched URL" />
                  <Table.Column cell={this.cell.bind(this)} title="操作" />
                </Table>
              </div>
            </TabPane>
            <TabPane key={2} tab={"rap2接口地址查找"}>
              <SearchForm
                type="close"
                locale={{ search: "查询", reset: "重置" }}
                showCount={6}
                labelCol={8}
                wrapperCol={16}
                onSearch={this.onSearch.bind(this)}
                onChange={this.onChangeFrom.bind(this)}
                dataSource={this.state.dataSource}
              />
              <div className='table-css-mt'></div>
              <Table dataSource={mapsList} optimization={false} >
                {/* <Table.Column
                  dataIndex="id"
                  width={60}
                  
                  title="id"
                /> */}
                {/* <Table.Column
                    dataIndex="req"
                    width={60}
                    cell={this.cellChecked.bind(this)}
                    title="是/否"
                  /> */}
                
                <Table.Column  title="Replaced URL" dataIndex='url' cell={this.cellUrl.bind(this)}  />
                {/* <Table.Column dataIndex="name" title="Matched URL" /> */}
                <Table.Column cell={this.addProxyRender.bind(this)} dataIndex='url' title="操作" />
              </Table>
            </TabPane>
            {/* <TabPane key={3} tab={"rap2"}>
              <iframe style={{height:'1000px',width:'100%'}} src='http://rap2.alibaba-inc.com/repository'></iframe>
            </TabPane> */}
          </Tab>
          <div className='styleNamePosi' data-spm-anchor-id="0.0.0.i0.4ef3f651QZRlAe">
            <img alt="HM01030365" src="https://work.alibaba-inc.com/photo/HM01030365.220x220.jpg" className="avatar" data-spm-anchor-id="0.0.0.i11.4ef3f651QZRlAe"/>
            <span className="name" data-spm-anchor-id="0.0.0.i12.4ef3f651QZRlAe">赵孔磊</span>
        </div>
        </div>
      </div>
    );
  }
}

export default Devtools;
