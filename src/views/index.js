import React from 'react';
import {Button,Grid ,Input, Feedback} from '@alife/hippo';
const { Row, Col } = Grid;
import '@alife/hippo/dist/hippo.css';
import '../css/index.css';
const {toast} = Feedback;
var bg = {};
if(chrome.extension){
   bg=chrome.extension.getBackgroundPage();
}
class HelloMessage extends React.Component {
    constructor(props){
        super(props)
        this.state={
            Data:[],
            $scope:{
                curRule:{
                   
                },
                inputError:"",
                maps:bg.ReResMap||[]
            },
            show:'none',
            type:1
        }
    }
    saveRule(){
        let $scope=this.state.$scope
        if (this.virify()) {
            if(this.state.type===1){
                $scope.curRule.checked=true
                $scope.maps.push($scope.curRule);
            }
            this.setState(({
                $scope,
                show:'none'
            }))
            bg.localStorage.ReResMap=JSON.stringify($scope.maps)
        }else{
            toast.error($scope.inputError)
        }

    }
    onChange(name,value){
        let $scope=this.state.$scope
        $scope.curRule[name]=value;
        this.setState({
            $scope:$scope
        })

    }
    virify() {
        let reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        
        let $scope=this.state.$scope;
        console.log(reg.test(!$scope.curRule.req))
        if (!$scope.curRule.req) {
            $scope.inputError = 'Replaced URL 输入不能为空';
            return false;
        }
        if(!reg.test($scope.curRule.req)) {
            $scope.inputError = 'Replaced URL 输入正确的url路径';
            return false;
        } 

        if (!$scope.curRule.res) {
            $scope.inputError = 'Matched URL 输入不能为空';
            return false;
        }
        if(!reg.test($scope.curRule.res)) {
            $scope.inputError = 'Matched URL 输入正确的url路径';
            return false;
        } 

        if($scope.curRule.req === $scope.curRule.res) {
            $scope.inputError = 'Matched URL 和 Replaced URL 不能相等';
            return false;
        } 

        $scope.inputError = '';
        return true;
    }
    add(status){
       let show= this.state.show;
        let $scope=this.state.$scope;
        $scope.curRule={
            plreq:"http://portal.hemaos.com",
            plres:"http://www.baidu.com"
        }
       this.setState({
           show:status,
           $scope,
           type:1
       })
    }
    edit(curRule){
        let $scope=this.state.$scope;
        $scope.curRule=curRule;
        this.setState({
            $scope,
            show:'block',
            type:2
        })
    }
    checked(value,index){
        let $scope=this.state.$scope;
        $scope.maps[index].checked=value;
        this.setState({
            $scope
        })
        bg.localStorage.ReResMap=JSON.stringify($scope.maps)

    }
    remove(rule){
        let $scope=this.state.$scope;
        for (var i = 0, len = $scope.maps.length; i < len; i++) {
            if ($scope.maps[i] === rule) {
                $scope.maps.splice(i, 1);
            }
        }
        this.setState({
            $scope
        })
        bg.localStorage.ReResMap=JSON.stringify($scope.maps)
    }
    render() {
        let $scope=this.state.$scope;
        let show=this.state.show
        return (
            <div>
                <Row className="demo-row">
                    <Col span="8"><div className="demo-col-inset">
                        <Button size="small" onClick={this.add.bind(this,true)} type="primary">
                            添加规则
                        </Button>
                    </div></Col>
                </Row>
                <div className="customize-limit" style={{display:show}}>
                    <div className="form-group">
                        <label>Replaced URL</label>
                        <div>
                            <Input type="text" placeholder={$scope.curRule.plreq}   onChange={this.onChange.bind(this,'req')}  value={$scope.curRule.req}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Matched URL</label>
                        <div>
                            <Input type="text" placeholder={$scope.curRule.plres}  onChange={this.onChange.bind(this,'res')}   value={$scope.curRule.res}/>
                        </div>
                    </div>
                </div>
                <div className='textAlgin' style={{display:show}}>
                    <Button size="small" onClick={this.saveRule.bind(this)} type="primary">
                        保存
                    </Button>
                </div>
                <table className="table table-hover">
                    <tbody>
                    {$scope.maps.map((item,index)=>{
                        return (
                            <tr key={index}>
                                <td>
                                    <label><input type="checkbox" checked={item.checked} onChange={this.checked.bind(this,!item.checked,index)} /> {item.req}</label>
                                    <button  type="button" className="btn btn-primary  next-btn-primary btn-xs edit" onClick={this.edit.bind(this,item)}>编辑
                                    </button>
                                    <button type="button" className="btn btn-default btn-xs remove" onClick={this.remove.bind(this,item)}>删除
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
        
            </div>
        );
    }
}

export default  HelloMessage
