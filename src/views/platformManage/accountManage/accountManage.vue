<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中">
    <!--查询输入框-->
    <div class="searchBox">
      <el-form ref="form" :model="form" label-width="200px" size="small">
        <el-input v-model="form.accountNo" class="searchInput" placeholder="请输入内容进行查询"></el-input>
        <el-button type="primary" @click="searchBtn" class="searchBtn">查询</el-button>
        <el-button type="primary" @click="createAccount">创建帐号</el-button>
        <!--创建工作人员帐号-->
        <el-dialog title="创建工作人员帐号" :visible.sync="dialogFormVisible" :append-to-body="true" width="60%">
          <div style="height:520px;overflow-y:auto">
            <el-form :model="adminForm">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input v-model="adminForm.name" auto-complete="off" placeholder="请输入工作人员姓名"></el-input>
              </el-form-item>
              <el-form-item label="帐号(手机号码)" :label-width="formLabelWidth">
                <el-input v-model="adminForm.account" auto-complete="off" :maxlength=11 placeholder="请输入工作人员帐号"></el-input>
              </el-form-item>
              <el-form-item label="身份证号码" :label-width="formLabelWidth">
                <el-input v-model="adminForm.IDNO" auto-complete="off" :maxlength=18 placeholder="请输入工作人员身份证号码"></el-input>
              </el-form-item>
              <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input type="password" v-model="adminForm.passWord" auto-complete="off" placeholder="请输入密码" @blur="passWordBlur"></el-input>
                <span class="passInfo">默认密码是6个1，密码长度不能小于6位</span>
              </el-form-item>
              <el-form-item label="确认密码" :label-width="formLabelWidth">
                <el-input type="password" v-model="adminForm.confirmPass" auto-complete="off" placeholder="请再次输入密码" @blur="confirmPassBlur"></el-input>
              </el-form-item>
              <el-form-item label="用户角色" :label-width="formLabelWidth">
                <el-select v-model="roleValue" placeholder="请选择" @change="changeChooseRole">
                  <el-option v-for="item in chooseRole" :key="item.roleValue" :label="item.label" :value="item.roleValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="管理区域" :label-width="formLabelWidth">
                <span class="currentPlace" v-show="showCurrentPlace">{{currentPlace}}</span>
                <RegionSelector ref="region" :hide="hideObj1" :county="chooseRegionCounty1" :station="chooseRegionStation1" v-show="showCreateRole"></RegionSelector>
                <el-button type="success" @click="addArea" class="searchBtn" icon="el-icon-plus">添加</el-button>
              </el-form-item>
              <el-form-item label="添加的区域" :label-width="formLabelWidth">
                <ul class="addArea">
                  <li v-for="(item,index) in addAreaArr" :key="index" @click="deletAddArea(index)">{{item}} <i class="el-icon-close"></i></li>
                </ul>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureBtn">确 定</el-button>
          </div>
        </el-dialog>
      </el-form>
    </div>
    <!--查询结果表格-->
    <div class="searchTable">
      <div class="villageChecked">
        <el-radio-group v-model="defaultRadio" @change="changeView">
          <el-radio :label="0">查看所有工作人员</el-radio>
          <el-radio :label="1">只看社区工作人员<span v-if="villageCountShow" class="villageCount"> (共有{{villageCount}}人)</span></el-radio>
          <el-radio :label="2">只看社区工作站管理员<span v-if="stationCountShow" class="villageCount"> (共有{{stationCount}}人)</span></el-radio>
          <el-radio :label="3">只看县级管理员<span v-if="countyCountShow" class="villageCount"> (共有{{countyCount}}人)</span></el-radio>
        </el-radio-group>
      </div>
      <el-table :data="workersUser" style="width: 100%" class="searchTable" border @sort-change="sortChange">
        <el-table-column type="index" :index="indexMethod" width="50">
        </el-table-column>
        <el-table-column label="姓名" width="120" sortable="custom">
                      <template slot-scope="scope">
                            <span>{{ scope.row.Name}}</span>
                      </template>
                </el-table-column>
                <el-table-column label="身份证号码" width="170" sortable="custom">
                    <template slot-scope="scope">
                      <span>{{ scope.row.CardId}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="电话号码" width="120" sortable="custom">
                    <template slot-scope="scope">
                      <span>{{ scope.row.Phone}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户角色" width="140" sortable="custom">
                      <template slot-scope="scope">
                        <span>{{ scope.row.workerRole}}</span>
                      </template>
                </el-table-column>
                <el-table-column label="创建时间" :label-width="drugLabelWidth" width="150" sortable="custom">
                    <template slot-scope="scope">
                      {{ scope.row.CreateTime}}
                    </template>
              </el-table-column>
                <el-table-column label="管理区域" sortable="custom">
                      <!--<template slot-scope="scope">
                        <span>{{ scope.row.Region}}</span>
                      </template>-->
              <template slot-scope="scope">
                <!-- <span>{{ scope.row.county }}  {{ scope.row.station}}  {{ scope.row.villages}}</span> -->
                <span>{{ scope.row.county }}  {{ scope.row.station}}  {{ scope.row.regionVillage}}</span>
              </template>
          </el-table-column>
          <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-show="handle">
              <el-button size="mini" type="success" @click="handleEditChange(scope.$index, scope.row)">管理</el-button>
              <!--  <el-button size="mini" type="primary" @click="handleAllot(scope.$index, scope.row)">分配</el-button>
              <el-button size="mini" type="danger" @click="handleReset(scope.$index, scope.row)">重置默认密码</el-button>
              <el-button size="mini" type="success" @click="handleEditChange(scope.$index, scope.row)" v-if="scope.row.showEdit">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">注销</el-button>
              <el-button size="mini" type="primary" v-if="scope.row.transfer" plain @click="handleEdit(scope.$index, scope.row)">转移</el-button> -->
            </div>
          </template>
           </el-table-column>
        </el-table>
        <!--默认状态下的分页-->
         <div class="pages" v-show="pages">
            <el-pagination @current-change="workerCurrentChange" background
            :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="pageTotal">
            </el-pagination>
         </div>
        <!--分配吸毒人员弹窗-->
         <el-dialog title="分配吸毒人员" :visible.sync="allotTableVisible" :append-to-body="true" width="80%">
           <div class="drugerWrapper">
            <el-table ref="multipleDrugerTable" :data="drugerList" stripe border tooltip-effect="dark"
             @row-click="selectRow" style="width: 100%" @selection-change="selectDruger">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="姓名" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.Name }}
                  </template>
              </el-table-column>
              <el-table-column label="身份证号码" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.Card_Id}}
                  </template>
              </el-table-column>
              <el-table-column label="民族" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.Ethnicity}}
                  </template>
              </el-table-column>
              <el-table-column label="性别" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.Sex }}
                  </template>
              </el-table-column>
              <el-table-column label="人员类型" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.Drugategory}}
                  </template>
              </el-table-column>
              <el-table-column label="吸食毒品类型" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.Variety_of_drugString}}
                  </template>
              </el-table-column>
              <el-table-column label="户籍地址" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.PermanentAddress}}
                  </template>
              </el-table-column>
             </el-table>
           </div>
           <div class="dialogFooter">
                <span class="allotCount">共有 {{allotCount}} 条</span>
                <el-button @click="allotTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotBtn">确定分配</el-button>
            </div>
         </el-dialog>
          <!--修改工作人员帐号信息-->
        <el-dialog title="修改工作人员信息" :visible.sync="editTableVisible" :append-to-body="true" width="60%">
             <el-form :model="workerInfo">
              <el-form-item label="修改姓名（可选）" :label-width="formLabelWidth">
                <el-input v-model="workerInfo.Name" auto-complete="off" placeholder="请输入要修改的姓名"></el-input>
              </el-form-item>
              <el-form-item label="修改手机号码（可选）" :label-width="formLabelWidth">
                <el-input v-model="workerInfo.Phone" auto-complete="off" :maxlength=11 placeholder="请输入要修改的手机号码"></el-input>
              </el-form-item>
              <el-form-item label="修改用户角色（可选）" :label-width="formLabelWidth">
              <el-select v-model="userRoleValue" placeholder="请选择要修改的用户角色" @change="editChooseRole">
                <el-option v-for="item in userRole" :key="item.userRoleValue" :label="item.label" :value="item.userRoleValue">
                </el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="修改管理区域（可选）" :label-width="formLabelWidth">
                <span class="currentPlace" v-show="showCurrentPlace">{{currentPlace}}</span>
               <RegionSelector ref="region" :hide="hideObj" :county="chooseRegionCounty" v-show="changeRegion" :station="chooseRegionStation" :defaults="defaults"></RegionSelector>
               <el-button type="success" @click="addEditArea" class="searchBtn" icon="el-icon-plus">添加修改</el-button>
            </el-form-item>
            <el-form-item label="当前管理区域" :label-width="formLabelWidth">
              <ul class="addArea">
                 <li v-for="(item,index) in editAreaArr" :key="index" @click="deletEditArea(index)">{{item}} <i class="el-icon-close"></i></li>
              </ul>
            </el-form-item>
            </el-form>
            <div class="editBtns">
                  <el-button size="small" type="primary" @click="handleAllot()" v-if="showAllot">分配</el-button>
                  <el-button size="small" type="danger" @click="handleDelete()">注销</el-button>
                  <el-button size="small" type="success" @click="handleEdit()">转移</el-button>
                  <el-button size="small" type="warning" @click="handleReset()">重置默认密码</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editTableVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmEdit">确定修改</el-button>
            </div>
         </el-dialog>
         <!--要删除的工作人员下的吸毒人员个数不为空的时候弹窗-->
         <el-dialog title="迁移吸毒人员" :visible.sync="removeTableVisible" :append-to-body="true" width="80%">
           <h2 v-if="drugerNum" class="drugerNum">您还有{{drugerNumLen}}个吸毒人员需要转移后才能注销!</h2>
           <div class="drugerWrapper">
            <el-table ref="transferDrugerTable" :data="removeDrugerList" stripe border tooltip-effect="dark"
             @row-click="selectDrugerRow" style="width: 100%" @selection-change="selectTransferDruger">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="姓名" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.Name }}
                  </template>
              </el-table-column>
              <el-table-column label="身份证号码" :label-width="drugLabelWidth">
                <template slot-scope="scope">
                  {{ scope.row.Card_Id}}
                </template>
              </el-table-column>
              <el-table-column label="民族" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.Ethnicity}}
                  </template>
              </el-table-column>
              <el-table-column label="性别" :label-width="drugLabelWidth">
                <template slot-scope="scope">
                  {{ scope.row.Sex }}
                </template>
              </el-table-column>
              <el-table-column label="人员类型" :label-width="drugLabelWidth">
                <template slot-scope="scope">
                  {{ scope.row.Drugategory}}
                </template>
              </el-table-column>
              <el-table-column label="吸食毒品类型" :label-width="drugLabelWidth">
                <template slot-scope="scope">
                  {{ scope.row.Variety_of_drugString}}
                </template>
              </el-table-column>
              <el-table-column label="户籍地址" :label-width="drugLabelWidth">
                  <template slot-scope="scope">
                    {{ scope.row.PermanentAddress}}
                  </template>
              </el-table-column>
             </el-table>
           </div>
           <el-form>
           <el-form-item label="选择工作人员:" :label-width="formLabelWidth">
              <!--工作站管理人员-->
              <div class="chooseWorker2">
               <span>{{this.belongVillage}}</span>
              </div>
              <div class="chooseWorker1">
              <el-select v-model="checkedWorker" placeholder="请选择工作人员" @change="changeCheckedWorker">
                  <el-option v-for="item in workersList" :key="item.Name" :label="item.label" :value="item.Name">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
           </el-form>
           <div class="dialogFooter">
                <span class="allotCount">共有 {{allotCount}} 条</span>
                <el-button @click="removeTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeDrugerBtn">确定转移</el-button>
            </div>
         </el-dialog>
        </div>
    </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import RegionSelector from '../../main-components/RegionSelector';
  import messageData from '../../../assets/region/message.json';
  var _this;
  export default {
    name: 'accountManage',
    components: {
      RegionSelector
    },
    data() {
      return {
        defaults: {
          default_ma: '',
          default_mb: '',
          default_mc: ''
        },
        addAreaArr: [],
        addAreaTextarea: '',
        showEdit: true,
        regionData: messageData,
        showAllot: true,
        hideObj: {
          county: false,
          station: false,
          village: false
        },
        hideObj1: {
          county: false,
          station: false,
          village: false
        },
        editAreaArr: [],
        changeRegion: true,
        changeWorkerObj: {},
        editWorkerRole: "",
        editWorkerRegion: "",
        editWorkerCardId: "",
        editWorkerPhone: "",
        editWorkerCounty: "",
        editWorkerStation: "",
        editWorkerVillage: "",
        changeWorkerRegion: [],
        editTableVisible: false,
        showCurrentPlace: false,
        currentPlace: "",
        chooseRegionCounty: "",
        chooseRegionStation: "",
        chooseRegionCounty1: "",
        chooseRegionStation1: "",
        defaultRadio: 0,
        drugerNum: false,
        drugerNumLen: 0,
        checkedValue: '',
        druguserCount: '',
        belongVillage: '',
        DrugId: '',
        chooseObj: {},
        transfer: false,
        checkedVillage: false,
        removeTableVisible: false,
        villageCountShow: false,
        villageChecked: false,
        stationCountShow: false,
        stationChecked: false,
        countyCountShow: false,
        countyChecked: false,
        villageCount: 0,
        stationCount: 0,
        countyCount: 0,
        higherWorker: false,
        superAdmin: false,
        stationWorker: false,
        workersList: [],
        villageArr: [],
        removeDrugerList: [],
        form: {
          accountNo: ''
        },
        userRoleValue: '',
        userRole: [{
          userRoleValue: "",
          label: ""
        }, {
          userRoleValue: "县级管理员",
          label: "县级管理员"
        }, {
          userRoleValue: "社区工作站管理员",
          label: "社区工作站管理员"
        }, {
          userRoleValue: "社区工作人员",
          label: "社区工作人员"
        }],
        showCreateRole: false,
        roleValue: '',
        chooseRole: [{
          roleValue: "",
          label: ""
        }, {
          roleValue: "县级管理员",
          label: "县级管理员"
        }, {
          roleValue: "社区工作站管理员",
          label: "社区工作站管理员"
        }, {
          roleValue: "社区工作人员",
          label: "社区工作人员"
        }],
        chooseOption: [{
          label: "姓名",
          checkedValue: "姓名"
        }, {
          label: "手机号码",
          checkedValue: "手机号码"
        }, {
          label: "身份证号码",
          checkedValue: "身份证号码"
        }],
        choosePhone: false,
        chooseID: false,
        chooseName: false,
        checkedValue: "",
        workerInfo: {},
        checkedVillage: '',
        checkedWorker: '',
        druguserCount: "",
        allotWorker: "",
        stationWorkerArr: [],
        value: '',
        allotCount: 0,
        pageTotal: null,
        drugerList: [],
        drugerPages: false,
        pages: false,
        drugerSelection: [],
        allotTableVisible: false,
        fullscreenLoading: false,
        dialogFormVisible: false,
        delteWorkerName: "",
        checkedStation: '',
        /*  adminForm: {
           name: '',
           account: '',
           IDNO: '',
           passWord: '111111',
           confrimPass:''
         }, */
        adminForm: {
          passWord: '111111'
        },
        props: {
          value: 'label'
        },
        myRegion: "",
        Region: '',
        myPhoneNum: '',
        token: '',
        myCounty: "",
        myStation: "",
        formLabelWidth: '160px',
        drugLabelWidth: '150px',
        searchControl: true,
        handle: false,
        areaArr: [],
        chooseVillage: "",
        selectedOptions: [],
        editOptions: [],
        DrugCradId: "",
        workersUser: [],
        phoneNum: "",
        currentPage: 1,
        checkedCounty: '',
        transferPhone: '',
        filterPage: 1,
        Jurisdiction: "",
        checkedPhone: '',
        editWorkerName: "",
        count:0,
        createCount:0,
        checkedRegion: [],
        transferSelection: []
      }
    },
    created() {
      _this = this;
      //进入页面默认显示
      for (var i = 0; i < this.workersUser.length; i++) {
        if (this.workersUser[i].searchAccount && this.workersUser[i].Phone && this.workersUser[i].Name &&
          this.workersUser[i].CardId && this.workersUser[i].Region) {
          this.handle = true;
        } else {
          this.handle = false;
        }
      }
      this.fullscreenLoading = true; //遮罩加载
      //获取管理区域json文件
      this.areaArr = this.regionData;
      //获取token
      this.token = Cookies.get('myToken');
      //获取登录手机号码
      this.myPhoneNum = Cookies.get('myPhoneNum');
      console.log(this.myPhoneNum);
      //获取区域
      this.myRegion = Cookies.get('myRegion');
      //获取县
      this.myCounty = Cookies.get('myCounty');
      //获取工作站
      this.myStation = Cookies.get('myStation');
      //获取管理区域权限
      this.Jurisdiction = Cookies.get('Jurisdiction');
      this.chooseObj = {
        CardId: this.form.accountNo,
        PhoneNumber: this.myPhoneNum,
        ToKen: this.token,
        Skip: 0
      }
      //进入页面加载工作人员信息表格
      this.searchWorker(this.chooseObj);
    },
    watch: {
      //监听工作人员查询
      "form.accountNo": function(value) {
        if (value) {
          this.workersUser = [];
          this.handle = false;
          this.pages = false;
        }
      }
    },
    methods: {
      //添加管理区域
      addArea: function() {
        if (this.roleValue == ""){
          this.$notify({
            title: '添加失败',
            message: '请先选择用户角色后选择管理区域后重试',
            type: 'warning',
            duration: 3000
          });
        } else {
          let addAreaItem = this.$refs.region.getRegion();
          let str = "";
          if (this.myRegion == '超级管理员') {
          for (var i = 0; i < addAreaItem.length; i++) {
            str += addAreaItem[i] + ' > ';
          }
          str = str.substring(0, str.length - 3);
          console.log(addAreaItem);
          console.log(str);
          this.addAreaArr.push(str);
          if (this.addAreaArr.indexOf(str) !== this.addAreaArr.lastIndexOf(str)) {
            this.$notify({
              title: '添加失败',
              message: '不能重复添加',
              type: 'warning',
              duration: 3000
            });
            this.addAreaArr.pop();
          }
        }else{
          if (this.myCounty && !this.myStation) {
            //县级管理员
            for (var i = 0; i < addAreaItem.length; i++) {
            str += addAreaItem[i] + ' > ';
          }
          str = str.substring(0, str.length - 3);
          console.log(addAreaItem);
          console.log(str);
          str = this.myCounty +' > '+ str; 
          this.addAreaArr.push(str);
          if (this.addAreaArr.indexOf(str) !== this.addAreaArr.lastIndexOf(str)) {
            this.$notify({
              title: '添加失败',
              message: '不能重复添加',
              type: 'warning',
              duration: 3000
            });
            this.addAreaArr.pop();
          }
          }else if (this.myCounty && this.myStation) {
             //工作站管理员
            for (var i = 0; i < addAreaItem.length; i++) {
            str += addAreaItem[i] + ' > ';
          }
          str = str.substring(0, str.length - 3);
          str = this.myCounty +' > '+ this.myStation + ' > ' + str; 
          this.addAreaArr.push(str);
          if (this.addAreaArr.indexOf(str) !== this.addAreaArr.lastIndexOf(str)) {
            this.$notify({
              title: '添加失败',
              message: '不能重复添加',
              type: 'warning',
              duration: 3000
            });
            this.addAreaArr.pop();
          }
          }
        }
       }
      },
      //添加要修改的管理区域
      addEditArea: function() {
        if (this.userRoleValue == "") {
          this.$notify({
            title: '添加失败',
            message: '请先选择要修改的用户角色后选择管理区域后重试',
            type: 'warning',
            duration: 3000
          });
        }else {
          let addAreaItem = this.$refs.region.getRegion();
          let str = "";
          if(this.myRegion == '超级管理员'){
            for (var i = 0; i < addAreaItem.length; i++) {
            if(addAreaItem[i]){
                 str += addAreaItem[i] + ' ';
            }else{
              this.$notify({
                title: '添加失败',
                message: '选择区域不能为空',
                type: 'warning',
                duration: 3000
              });
              return;
            }
          }
          str = str.substring(0, str.length - 1);
          this.editAreaArr.push(str);
         if (this.editAreaArr.indexOf(str) !== this.editAreaArr.lastIndexOf(str)) {
            this.$notify({
              title: '添加失败',
              message: '不能重复添加',
              type: 'warning',
              duration: 3000
            });
            this.editAreaArr.pop();
          }
          }else{
            if (this.myCounty && !this.myStation){
              //县级管理员
              for (var i = 0; i < addAreaItem.length; i++) {
            if(addAreaItem[i]){
                 str += addAreaItem[i] + ' ';
            }else{
              this.$notify({
                title: '添加失败',
                message: '选择区域不能为空',
                type: 'warning',
                duration: 3000
              });
              return;
            }
          }
          str = this.myCounty +' '+ str; 
          str = str.substring(0, str.length - 1);
          this.editAreaArr.push(str); 
          console.log(str);
          console.log(this.editAreaArr);
           if (this.editAreaArr.indexOf(str) !== this.editAreaArr.lastIndexOf(str)) {
            this.$notify({
              title: '添加失败',
              message: '不能重复添加',
              type: 'warning',
              duration: 3000
            });
            this.editAreaArr.pop();
          }
            }else if(this.myCounty && this.myStation){
              //工作站管理员
              console.log('工作站管理员');
              for (var i = 0; i < addAreaItem.length; i++) {
                if(addAreaItem[i]){
                      str += addAreaItem[i] + ' ';
                }else{
                  this.$notify({
                    title: '添加失败',
                    message: '选择区域不能为空',
                    type: 'warning',
                    duration: 3000
                  });
                  return;
                }
            }
          str = this.myCounty +' '+this.myStation +' '+ str;  
          str = str.substring(0, str.length - 1);
          this.editAreaArr.push(str); 
          if (this.editAreaArr.indexOf(str) !== this.editAreaArr.lastIndexOf(str)) {
            this.$notify({
              title: '添加失败',
              message: '不能重复添加',
              type: 'warning',
              duration: 3000
            });
            this.editAreaArr.pop();
          }
            }
          }
        }
      },
      //删除添加的管理区域
      deletAddArea: function(index) {
        this.addAreaArr.splice(index, 1);
      },
      //删除修改工作人员信息现有的管理区域
      deletEditArea: function(index) {
        this.editAreaArr.splice(index, 1);
      },
      //列排序改变
      sortChange(val) {
        switch (val.column.label) {
          case "姓名":
            if (val.column.order == "ascending") {
              this.chooseObj.Sort = "Sort4";
              this.searchWorker(this.chooseObj);
            } else {
              this.chooseObj.Sort = "Sort3";
              this.searchWorker(this.chooseObj);
            }
            break;
          case "身份证号码":
            if (val.column.order == "ascending") {
              this.chooseObj.Sort = "Sort8";
              this.searchWorker(this.chooseObj);
            } else {
              this.chooseObj.Sort = "Sort7";
              this.searchWorker(this.chooseObj);
            }
            break;
          case "电话号码":
            if (val.column.order == "ascending") {
              this.chooseObj.Sort = "Sort6";
              this.searchWorker(this.chooseObj);
            } else {
              this.chooseObj.Sort = "Sort5";
              this.searchWorker(this.chooseObj);
            }
            break;
          case "创建时间":
            if (val.column.order == "ascending") {
              this.chooseObj.Sort = "Sort2";
              this.searchWorker(this.chooseObj);
            } else {
              this.chooseObj.Sort = "Sort1";
              this.searchWorker(this.chooseObj);
            }
            break;
          case "管理区域":
            if (val.column.order == "ascending") {
              this.chooseObj.Sort = "Sort10";
              this.searchWorker(this.chooseObj);
            } else {
              this.chooseObj.Sort = "Sort9";
              this.searchWorker(this.chooseObj);
            }
            break;
          case "用户角色":
            if (val.column.order == "ascending") {
              this.chooseObj.Sort = "Sort12";
              this.searchWorker(this.chooseObj);
            } else {
              this.chooseObj.Sort = "Sort11";
              this.searchWorker(this.chooseObj);
            }
            break;
        }
      },
      //重置工作人员密码
      handleReset: function() {
        console.log(this.editWorkerPhone);
        this.$confirm(`确定要将工作人员（${this.editWorkerName}）的密码重置为默认密码吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http
            .post(this.serverIP + "/index/restorepassword", {
              ToKen: this.token,
              PhoneNumber: this.myPhoneNum,
              WorkerPhoneNumber: this.editWorkerPhone
            }).then(response => {
              console.log(response);
              if (response.data.errno == 0) {
                this.$notify({
                  title: '重置密码成功',
                  message: response.data.errmsg,
                  type: 'success',
                  duration: 3000
                });
              } else {
                this.$notify({
                  title: '重置密码失败',
                  message: response.data.errmsg,
                  type: 'warning',
                  duration: 3000
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置默认密码'
          });
        });
      },
      //序号
      indexMethod(index) {
        return 10 * (this.currentPage - 1) + index + 1;
      },
      //输入密码失去焦点
      passWordBlur: function() {
        if (this.adminForm.passWord) {
          if (this.adminForm.passWord.length < 6) {
            this.$notify({
              message: '密码的长度不能少于6位',
              type: 'warning',
              duration: 4000
            });
          }
        } else {
          this.$notify({
            message: '密码不能为空',
            type: 'warning',
            duration: 4000
          });
        }
      },
      //再次输入密码失去焦点
      confirmPassBlur: function() {
        // console.log(this.adminForm.confirmPass)
        if (this.adminForm.passWord) {
          if (this.adminForm.confirmPass !== this.adminForm.passWord) {
            this.$notify({
              message: '两次输入的密码不一致，请检查后重试',
              type: 'warning',
              duration: 4000
            });
            this.adminForm.confirmPass = "";
          }
        } else {
          this.$notify({
            message: '请先输入密码，再输入确认密码',
            type: 'warning',
            duration: 4000
          });
        }
      },
      //创建工作人员帐号的时候用户角色改变
      changeChooseRole: function() {
        console.log(this.roleValue);
        if (this.roleValue == "县级管理员") {
          this.showCreateRole = true;
          this.hideObj1.county = false;
          this.hideObj1.station = true;
          this.hideObj1.village = true;
        } else if (this.roleValue == "社区工作站管理员") {
          this.showCreateRole = true;
          // 显示
          this.hideObj1.county = false;
          // 显示
          this.hideObj1.station = false;
          // 隐藏
          this.hideObj1.village = true;
        } else if (this.roleValue == "社区工作人员") {
          this.showCreateRole = true;
          // 显示
          this.hideObj1.county = false;
          // 显示
          this.hideObj1.station = false;
          // 显示
          this.hideObj1.village = false;
        } else {
          this.showCreateRole = false;
        }
      },
      //修改工作人员帐号的时候用户角色改变
      editChooseRole: function() {
        if (this.userRoleValue == this.editWorkerRole) {
          this.defaults.default_ma = this.editWorkerCounty;
          this.defaults.default_mb = this.editWorkerStation;
          this.defaults.default_mc = this.editWorkerVillage;
        }
        if (this.userRoleValue == "县级管理员") {
          this.defaults.default_ma = this.editWorkerCounty;
          this.hideObj.county = false;
          this.hideObj.station = true;
          this.hideObj.village = true;
          this.changeRegion = true;
          console.log('县')
        } else if (this.userRoleValue == "社区工作站管理员") {
          this.defaults.default_ma = this.editWorkerCounty;
          this.defaults.default_mb = this.editWorkerStation;
          // 显示
          this.hideObj.county = false;
          // 显示
          this.hideObj.station = false;
          // 隐藏
          this.hideObj.village = true;
          this.changeRegion = true;
           console.log('工作站')
        } else if (this.userRoleValue == "社区工作人员") {
          // 显示
          this.hideObj.county = false;
          // 显示
          this.hideObj.station = false;
          // 显示
          this.hideObj.village = false;
          this.changeRegion = true;
          this.defaults.default_ma = this.editWorkerCounty;
          this.defaults.default_mb = this.editWorkerStation;
          this.defaults.default_mc = this.editWorkerVillage;
           console.log('社区')
        } else if (this.userRoleValue == "") {
          this.changeRegion = false;
          this.defaults.default_ma = '';
          this.defaults.default_mb = '';
          this.defaults.default_mc = '';
        }  
      },
      //查看改变
      changeView: function(value) {
        if (value == 0) {
          //查看所有工作人员
          this.fullscreenLoading = true;
          delete this.chooseObj.OnlyStation;
          delete this.chooseObj.OnlyCounty;
          delete this.chooseObj.OnlyVillages;
          this.villageCountShow = false;
          this.stationCountShow = false;
          this.countyCountShow = false;
          this.searchWorker(this.chooseObj);
        } else if (value == 1) {
          //查看乡镇工作人员
          this.fullscreenLoading = true;
          delete this.chooseObj.OnlyStation;
          delete this.chooseObj.OnlyCounty;
          this.villageCountShow = true;
          this.stationCountShow = false;
          this.countyCountShow = false;
          this.chooseObj.OnlyVillages = "1";
          this.searchWorker(this.chooseObj);
        } else if (value == 2) {
          //查看工作站工作人员
          this.fullscreenLoading = true;
          delete this.chooseObj.OnlyVillages;
          delete this.chooseObj.OnlyCounty;
          this.stationCountShow = true;
          this.villageCountShow = false;
          this.countyCountShow = false;
          this.chooseObj.OnlyStation = "1";
          this.searchWorker(this.chooseObj);
        } else if (value == 3) {
          //查看县级工作人员
          this.fullscreenLoading = true;
          delete this.chooseObj.OnlyVillages;
          delete this.chooseObj.OnlyStation;
          this.stationCountShow = false;
          this.villageCountShow = false;
          this.countyCountShow = true;
          this.chooseObj.OnlyCounty = "1";
          this.searchWorker(this.chooseObj);
        }
      },
      //是否选择只查看乡镇工作人员
      viewVillage: function() {
        this.fullscreenLoading = true;
        if (this.villageChecked) {
          this.villageCountShow = true;
          this.chooseObj.OnlyVillages = "1";
          this.searchWorker(this.chooseObj);
        } else {
          delete this.chooseObj.OnlyVillages;
          this.searchWorker(this.chooseObj);
          this.villageCountShow = false;
        }
      },
      //是否选择只看工作站工作人员
      viewStation: function() {
        this.fullscreenLoading = true;
        if (this.stationChecked) {
          this.stationCountShow = true;
          this.chooseObj.OnlyStation = "1";
          this.searchWorker(this.chooseObj);
        } else {
          delete this.chooseObj.OnlyStation;
          this.searchWorker(this.chooseObj);
          this.stationCountShow = false;
        }
      },
      //是否选择只看县级工作人员
      viewCounty: function() {
        if (this.countyChecked) {
          this.countyCountShow = true;
          this.chooseObj.OnlyCounty = "1";
          this.searchWorker(this.chooseObj);
        } else {
          delete this.chooseObj.OnlyCounty;
          this.searchWorker(this.chooseObj);
          this.countyCountShow = false;
        }
      },
      //工作站人员选择管理区域改变
      changeValue: function(value) {
        let obj = {};
        obj = this.stationWorkerArr.find((item) => {
          return item.value === value;
        });
        this.chooseVillage = obj.label;
        console.log(this.chooseVillage);
      },
      //选择乡镇改变
      changeVillage: function(value) {
        this.checkedWorker = "";
        let obj = {};
        obj = this.villageArr.find((item) => {
          return item.value === value;
        });
        this.checkedVillage = obj.label;
        console.log(this.checkedVillage);
        //根据乡镇加载该乡镇下面的工作人员
        this.$http
          .post(this.serverIP + "/query/queryworkers", {
            ToKen: this.token,
            PhoneNumber: this.myPhoneNum,
            County: this.checkedCounty,
            Station: this.checkedStation,
            Villages: this.checkedVillage
          }).then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.workersList = response.data.data.workersUser;
              console.log(this.workersList);
            } else {
              this.$notify({
                title: '查询失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      //选择工作人员
      changeCheckedWorker: function(value) {
        //根据乡镇加载该乡镇下面的工作人员
        for (var i = 0; i < this.workersList.length; i++) {
          if (this.workersList[i].Name == value) {
            this.transferPhone = this.workersList[i].Phone;
          }
        }
      },
      //创建帐号
      createAccount: function() {
        this.roleValue = "";
        this.addAreaArr = [];
        this.showCreateRole = false;
        this.dialogFormVisible = true;
        if (this.myRegion == '超级管理员') {
          //超级管理员
          this.showCurrentPlace = false;
          this.chooseRole = [{
            roleValue: "",
            label: ""
          }, {
            roleValue: "县级管理员",
            label: "县级管理员"
          }, {
            roleValue: "社区工作站管理员",
            label: "社区工作站管理员"
          }, {
            roleValue: "社区工作人员",
            label: "社区工作人员"
          }];
        } else {
          if (this.myCounty && !this.myStation) {
            //判断为县级帐号
            this.showCurrentPlace = true;
            this.currentPlace = this.myCounty;
            this.chooseRegionCounty1 = this.myCounty;
            this.chooseRole = [{
              roleValue: "",
              label: ""
            }, {
              roleValue: "社区工作站管理员",
              label: "社区工作站管理员"
            }, {
              roleValue: "社区工作人员",
              label: "社区工作人员"
            }];
          } else if (this.myCounty && this.myStation) {
            //判断为工作站帐号
            this.showCurrentPlace = true;
            this.currentPlace = this.myCounty + ' / ' + this.myStation;
            this.chooseRole = [{
              roleValue: "",
              label: ""
            }, {
              roleValue: "社区工作人员",
              label: "社区工作人员"
            }];
            this.chooseRegionCounty1 = this.myCounty;
            this.chooseRegionStation1 = this.myStation;
          }
        }
      },
      //点击吸毒人员前面复选框
      selectDruger(val) {
        this.drugerSelection = val;
        console.log(this.drugerSelection);
      },
      //点击要被转移的吸毒人员前面的复选框
      selectTransferDruger(val) {
        this.transferSelection = val;
      },
      //分配吸毒人员的时候选择一行
      selectRow: function(row) {
        this.$refs.multipleDrugerTable.toggleRowSelection(row);
      },
      //转移吸毒人员的时候选择一行
      selectDrugerRow: function(row) {
        this.$refs.transferDrugerTable.toggleRowSelection(row);
      },
      //确定分配吸毒人员
      allotBtn: function() {
        console.log(this.phoneNum);
        console.log(this.drugerSelection);
        //连接要分配的吸毒人员
        if (this.drugerSelection.length !== 0) {
          if (this.drugerSelection.length > 1) {
            this.DrugCradId = "";
            for (var i = 0; i < this.drugerSelection.length; i++) {
              this.DrugCradId += this.drugerSelection[i].Card_Id + "@";
            }
            this.DrugCradId = this.DrugCradId.substring(0, this.DrugCradId.length - 1);
          } else {
            this.DrugCradId = this.drugerSelection[0].Card_Id;
          }
          this.$confirm(`确定要分配给工作人员（${this.allotWorker}）吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http
              .post(this.serverIP + "/query/binddrug", {
                PhoneNumber: this.myPhoneNum,
                ToKen: this.token,
                DrugCradId: this.DrugCradId,
                WorkPhoneNumber: this.phoneNum
              })
              .then(response => {
                console.log(response);
                if (response.data.errno == 0) {
                  let errmsg = response.data.data;
                  let str = "";
                  let str1 = "";
                  for (var i = 0; i < errmsg.length; i++) {
                    if (errmsg[i].content.errmsg == 0) {
                      str += errmsg[i].content.content;
                      this.allotTableVisible = false;
                    } else if (errmsg[i].content.errmsg == 1000) {
                      str1 += errmsg[i].content.content;
                    }
                  }
                  if (str) {
                    this.$notify({
                      title: '分配成功',
                      message: str,
                      type: 'success',
                      duration: 3000
                    });
                  } else {
                    this.$notify({
                      title: '分配失败',
                      message: str1,
                      type: 'warning',
                      duration: 3000
                    });
                  }
                } else {
                  this.$notify({
                    title: '分配失败',
                    message: response.data.errmsg,
                    type: 'warning',
                    duration: 3000
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消分配'
            });
          });
        } else {
          this.$notify({
            title: '提示',
            message: '请选择要分配的吸毒人员',
            type: 'warning',
            duration: 3000
          });
        }
      },
      //点击迁移，迁移工作人员下面的吸毒人员
      handleEdit(val) {
        if (val == 1) {
          this.drugerNum = true;
        } else {
          this.drugerNum = false;
        }
        this.checkedValue = '';
        this.checkedWorker = '';
        this.removeTableVisible = true;
        this.delteWorkerName = this.editWorkerName;
        this.checkedCounty = this.editWorkerCounty;
        this.checkedStation = this.editWorkerStation;
        this.checkedPhone = this.editWorkerPhone;
        this.belongVillage = this.editWorkerVillage;
        //加载乡镇数据
        for (var i = 0; i < this.areaArr.length; i++) {
          for (var j = 0; j < this.areaArr[i].children.length; j++) {
            if (this.areaArr[i].children[j].label == this.checkedStation) {
              this.villageArr = this.areaArr[i].children[j].children;
            }
          }
        }
        //获取要注销的工作人员下面的吸毒人员列表
        this.$http
          .post(this.serverIP + "/query/queryregiondrugbindinfo", {
            PhoneNumber: this.myPhoneNum,
            ToKen: this.token,
            WorkerPhoneNumber: this.editWorkerPhone
          })
          .then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.allotCount = response.data.data.count;
              this.removeDrugerList = response.data.data.druguser;
              for (var i = 0; i < this.removeDrugerList.length; i++) {
                switch (this.removeDrugerList[i].Sex) {
                  case 0:
                    this.removeDrugerList[i].Sex = "";
                    break;
                  case 1:
                    this.removeDrugerList[i].Sex = "男";
                    break;
                  case 2:
                    this.removeDrugerList[i].Sex = "女";
                }
              }
            } else {
              this.$notify({
                title: '查询吸毒人员列表失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
        //根据乡镇加载该乡镇下面的工作人员
        this.$http
          .post(this.serverIP + "/query/queryworkers", {
            ToKen: this.token,
            PhoneNumber: this.myPhoneNum,
            County: this.checkedCounty,
            Station: this.checkedStation,
            Villages: this.belongVillage
          }).then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.workersList = response.data.data.workersUser;
              console.log(this.workersList);
            } else {
              this.$notify({
                title: '查询失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      //管理-修改工作人员帐号信息
      handleEditChange: function(index, row) {
        console.log(row);
        this.workerInfo = {};
        this.editTableVisible = true;
        this.editWorkerName = row.Name;
        this.editWorkerPhone = row.Phone;
        this.editWorkerRegion = row.Region;
        this.editWorkerRole = row.workerRole;
        this.editWorkerCounty = row.county;
        this.editWorkerStation = row.station;
        this.editWorkerVillage = row.villages;
        this.editWorkerCardId = row.CardId;
        this.userRoleValue = "";
        this.changeRegion = false;
        this.defaults.default_ma = '';
        this.defaults.default_mb = '';
        this.defaults.default_mc = ''; 
        //判断点击的用户权限
        if (row.workerRole == "社区工作人员") {
          this.showAllot = true;
        } else {
          this.showAllot = false;
        }
        //判断工作人员人员类型
        this.editAreaArr = [];
        let arrItem = this.editWorkerCounty + ' ' + this.editWorkerStation + ' ';
        if (row.UserType == 2) {
          if (this.editWorkerRegion instanceof Array) {
            this.editAreaArr = this.editWorkerRegion.map((item) => {
              return arrItem + item;
            })
          } else {
            arrItem += this.editWorkerRegion;
            this.editAreaArr.push(arrItem);
          }
        } else if (row.UserType == 3) {
          arrItem += this.editWorkerVillage;
          this.editAreaArr.push(arrItem);
        }
        //判断登录用户权限
        if (this.Jurisdiction == "ADMIN") {
          //超级管理员
          this.showCurrentPlace = false;
          this.userRole = [{
            userRoleValue: "",
            label: ""
          }, {
            userRoleValue: "县级管理员",
            label: "县级管理员"
          }, {
            userRoleValue: "社区工作站管理员",
            label: "社区工作站管理员"
          }, {
            userRoleValue: "社区工作人员",
            label: "社区工作人员"
          }];
        } else if (this.Jurisdiction == "1") {
          //县级工作人员
           this.showCurrentPlace = true;
          this.currentPlace = this.myCounty;
          this.userRole = [{
            userRoleValue: "",
            label: ""
          }, {
            userRoleValue: "社区工作站管理员",
            label: "社区工作站管理员"
          }, {
            userRoleValue: "社区工作人员",
            label: "社区工作人员"
          }];
          this.chooseRegionCounty = this.myCounty;
        } else if (this.Jurisdiction == "2") {
          //工作站管理员
          //  this.userRoleValue = "社区工作人员";
          this.showCurrentPlace = true;
          this.currentPlace = this.myCounty + ' / ' + this.myStation;
          this.userRole = [{
            userRoleValue: "",
            label: ""
          }, {
            userRoleValue: "社区工作人员",
            label: "社区工作人员"
          }];
          this.chooseRegionCounty = this.myCounty;
          this.chooseRegionStation = this.myStation;
        }
      },
      //封装确定修改工作人员
      packingConfirmEdit: function(obj) {
        this.$http
          .post(this.serverIP + "/index/modifyinformation", obj).then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.$notify({
                title: '修改成功',
                message: response.data.errmsg,
                type: 'success',
                duration: 3000
              });
              //刷新
              this.editTableVisible = false;
              this.workerInfo = {};
              this.searchWorker(this.chooseObj);
            } else {
              this.$notify({
                title: '修改失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      //确定修改工作人员账户信息
      confirmEdit: function() {
        this.changeWorkerRegion = this.$refs.region.getRegion();
        this.changeWorkerObj.ToKen = this.token;
        this.changeWorkerObj.PhoneNumber = this.myPhoneNum;
        this.changeWorkerObj.WorkerPhoneNumber = this.editWorkerPhone;
        delete this.changeWorkerObj.County;
        delete this.changeWorkerObj.Station;
        delete this.changeWorkerObj.Villages;
        delete this.changeWorkerObj.ModifyUserRegion;
        delete this.changeWorkerObj.ModifyPhone;
        delete this.changeWorkerObj.ModifyName;
         /* if (this.changeWorkerRegion[0]) {
          this.changeWorkerObj.County = this.changeWorkerRegion[0];
          this.changeWorkerObj.Station = this.changeWorkerRegion[1];
          this.changeWorkerObj.Villages = this.changeWorkerRegion[2];
          this.changeWorkerObj.ModifyUserRegion = this.changeWorkerRegion[this.changeWorkerRegion.length - 1];
        } */
        let areaStr = "";
        let villageStr = "";
        if (this.editAreaArr.length > 1) {
          for (var i = 0; i < this.editAreaArr.length; i++) {
            areaStr += this.editAreaArr[i].substring(this.editAreaArr[i].lastIndexOf(' ') + 1, this.editAreaArr[i].length) + '$';
          }
          villageStr = this.editAreaArr[0].substring(this.editAreaArr[0].lastIndexOf(' ') + 1, this.editAreaArr[0].length);
          areaStr = areaStr.substring(0, areaStr.length - 1);
        } else if (this.editAreaArr.length == 1) {
          areaStr = this.editAreaArr[0].substring(this.editAreaArr[0].lastIndexOf(' ') + 1, this.editAreaArr[0].length);
          villageStr = this.editAreaArr[0].substring(this.editAreaArr[0].lastIndexOf(' ') + 1, this.editAreaArr[0].length);
        }
          if(this.myRegion == '超级管理员'){
            this.changeWorkerObj.County = this.changeWorkerRegion[0] || this.editWorkerCounty;
            this.changeWorkerObj.Station = this.changeWorkerRegion[1] || this.editWorkerStation;
            this.changeWorkerObj.Villages = villageStr;
            this.changeWorkerObj.ModifyUserRegion = areaStr;
         }else{
          if (this.myCounty && !this.myStation) {
            //县级管理员
            console.log(this.changeWorkerRegion);
            this.changeWorkerObj.County = this.myCounty;
            this.changeWorkerObj.Station = this.changeWorkerRegion[0] || this.editWorkerStation;
            this.changeWorkerObj.Villages = villageStr;
            this.changeWorkerObj.ModifyUserRegion = areaStr;
          }else if(this.myCounty && this.myStation){
            //工作站管理员
            this.changeWorkerObj.County = this.myCounty;
            this.changeWorkerObj.Station = this.myStation;
            this.changeWorkerObj.Villages = villageStr;
            this.changeWorkerObj.ModifyUserRegion = areaStr;
          }
        }
        
        console.log(areaStr);
        console.log(villageStr);
        if (this.workerInfo.Name) {
          this.changeWorkerObj.ModifyName = this.workerInfo.Name;
        }
        if (this.workerInfo.Phone) {
          console.log(this.workerInfo.Phone);
          this.changeWorkerObj.ModifyPhone = this.workerInfo.Phone;
        }
        console.log(this.changeWorkerObj);
        this.$confirm(`确认修改工作人员（${this.editWorkerName}）信息吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.editAreaArr.length > 0 || this.workerInfo.Name || this.workerInfo.Phone) {
              this.packingConfirmEdit(this.changeWorkerObj);
            }else{
               this.$notify({
                title: '修改失败',
                message: '请检查修改内容后重试',
                type: 'warning',
                duration: 3000
              });
            }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });
        });
      },
      //注销工作人员
      handleDelete() {
        //注销工作人员前，检查工作人员下面的吸毒人员个数
        this.$http
          .post(this.serverIP + "/query/queryregiondrugbindinfo", {
            PhoneNumber: this.myPhoneNum,
            ToKen: this.token,
            WorkerPhoneNumber: this.editWorkerPhone
          })
          .then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.druguserCount = response.data.data.count;
              this.removeDrugerList = response.data.data.druguser;
              this.drugerNumLen = response.data.data.count;
              console.log(this.druguserCount);
              if (this.druguserCount == 0) {
                //工作人员下的吸毒人员为0的时候直接删除
                this.$confirm(`请注意，账号注销后，该账号将永久无法使用。确定注销工作人员（${this.editWorkerName}）吗？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$http
                    .post(this.serverIP + "/index/workeruserdelete", {
                      PhoneNumber: this.myPhoneNum,
                      ToKen: this.token,
                      WorkerPhoneNumber: this.editWorkerPhone,
                      WorkerCradId: this.editWorkerCardId,
                      WorkerName: this.editWorkerName
                    })
                    .then(response => {
                      console.log(response);
                      if (response.data.errno == 0) {
                        this.$notify({
                          title: `注销工作人员${this.editWorkerName}成功`,
                          message: response.data.errmsg,
                          type: 'success',
                          duration: 3000
                        });
                        //注销成功后刷新页面
                        this.searchWorker(this.chooseObj);
                      } else {
                        this.$notify({
                          title: '注销该工作人员失败',
                          message: response.data.errmsg,
                          type: 'warning',
                          duration: 3000
                        });
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              } else {
                // this.handleEdit(index,row,1);
                this.handleEdit(1);
                // this.$router.push('/personManage/assignWorkers');
              }
            } else {
              this.$notify({
                title: '查询吸毒人员列表失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      //确定转移要删除的工作人员下面的吸毒人员
      removeDrugerBtn: function() {
        console.log(this.transferPhone);
        console.log(this.transferSelection);
        if (this.transferSelection.length !== 0 && this.checkedWorker) {
          if (this.transferSelection.length > 1) {
            console.log(111);
            this.DrugId = "";
            for (var i = 0; i < this.transferSelection.length; i++) {
              this.DrugId += this.transferSelection[i].Card_Id + "@";
            }
            this.DrugId = this.DrugId.substring(0, this.DrugId.length - 1);
          } else {
            this.DrugId = this.transferSelection[0].Card_Id;
          }
          console.log(this.DrugId);
          this.$confirm(`确定要将${this.delteWorkerName}下的吸毒人员转移给${this.checkedWorker}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http
              .post(this.serverIP + "/index/transferstaff", {
                ToKen: this.token,
                DrugCradId: this.DrugId,
                PhoneNumber: this.myPhoneNum,
                FirstWorkerPhoneNumber: this.checkedPhone,
                SecondWorkerPhoneNumber: this.transferPhone,
              }).then(response => {
                console.log(response);
                if (response.data.errno == 0) {
                  let errmsg = response.data.data;
                  let str = "";
                  let str1 = "";
                  for (var i = 0; i < errmsg.length; i++) {
                    if (errmsg[i].errmsg == 0) {
                      str += errmsg[i].content;
                      this.removeTableVisible = false;
                    } else if (errmsg[i].errmsg == 1000) {
                      str1 += errmsg[i].content;
                    }
                  }
                  console.log(str);
                  if (str) {
                    this.$notify({
                      title: '迁移成功',
                      message: str,
                      type: 'success',
                      duration: 3000
                    });
                  } else {
                    this.$notify({
                      title: '迁移失败',
                      message: str1,
                      type: 'warning',
                      duration: 3000
                    });
                  }
                } else {
                  this.$notify({
                    title: '转移失败',
                    message: response.data.errmsg,
                    type: 'warning',
                    duration: 3000
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消转移'
            });
          });
        } else {
          this.$notify({
            title: '提示',
            message: '请检查是否选择了工作人员和吸毒人员',
            type: 'warning',
            duration: 3000
          });
        }
      },
      //查询工作人员下面的吸毒人员
      searchDrugers: function(obj) {
        this.$http
          .post(this.serverIP + "/query/queryregiondruginfo", obj)
          .then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.allotCount = response.data.data.count;
              this.drugerList = response.data.data.druguser;
              for (var i = 0; i < this.drugerList.length; i++) {
                switch (this.drugerList[i].Sex) {
                  case 0:
                    this.drugerList[i].Sex = "";
                    break;
                  case 1:
                    this.drugerList[i].Sex = "男";
                    break;
                  case 2:
                    this.drugerList[i].Sex = "女";
                }
              }
            } else {
              this.$notify({
                title: '查询吸毒人员列表失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      //分配吸毒人员
      handleAllot() {
        this.allotTableVisible = true;
        /*  this.phoneNum = row.Phone;
         this.allotWorker = row.Name; */
        this.phoneNum = this.editWorkerPhone;
        this.allotWorker = this.editWorkerName;
        //查询工作人员下面的吸毒人员
        this.searchDrugers({
          PhoneNumber: this.myPhoneNum,
          ToKen: this.token,
          WorkerPhoneNumber: this.editWorkerPhone
        });
      },
      //封装选择区域，查看工作人员
      changeWorker: function(obj) {
        this.$http
          .post(this.serverIP + "/query/queryworkers", obj)
          .then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.workersList = response.data.data.workersUser;
            } else {
              this.$notify({
                title: '查询失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      //创建工作人员管理区域选中值
      handleChange(value) {
        this.Region = value;
        console.log(this.Region);
        this.workersList = [];
        //根据选择区域，加载对应的工作人员
        if (this.myRegion == '超级管理员') {
          //超级管理员
          this.changeWorker({
            ToKen: this.token,
            County: this.Region[0],
            station: this.Region[1],
            Villages: this.Region[2],
            OnlyVillages: 1,
            PhoneNumber: this.myPhoneNum,
            Skip: 0
          });
        } else {
          if (this.myCounty && !this.myStation) {
            //判断为县级帐号
            this.changeWorker({
              ToKen: this.token,
              County: this.Region[0],
              station: this.Region[1],
              Villages: 1,
              PhoneNumber: this.myPhoneNum,
              Skip: 0
            });
          } else if (this.myCounty && this.myStation) {
            //判断为工作站帐号
            this.changeWorker({
              ToKen: this.token,
              County: this.myCounty,
              station: this.myStation,
              Villages: 1,
              PhoneNumber: this.myPhoneNum,
              Skip: 0
            });
          }
        }
      },
      //修改工作人员管理区域选中值
      editChange(value) {
        console.log(value);
      },
      //封装创建工作人员帐号函数
      createWoker: function(obj) {
        this.$http
          .post(this.serverIP + "/index/workeruseradd", obj)
          .then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.$notify({
                title: '创建成功',
                message: response.data.errmsg,
                type: 'success',
                duration: 3000
              });
              this.defaultRadio = 0;
              this.dialogFormVisible = false;
              this.adminForm = {};
              this.selectedOptions = [];
              this.handle = false;
              this.pages = false;
              this.roleValue = "";
              //创建成功后刷新页面
              this.searchWorker(this.chooseObj);
              this.adminForm = {
                passWord: '111111'
              };
              this.filterPage = 1;
              this.pages = false;
              this.filterPages = true;
              this.villageCountShow = false;
              this.stationCountShow = false;
              this.countyCountShow = false;
            } else {
              this.fullscreenLoading = false;
              this.$notify({
                title: '创建失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
              this.pages = false;
              this.handle = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      //创建工作人员帐号保存
      sureBtn: function() {
        this.workersUser = [];
        this.checkedRegion = this.$refs.region.getRegion();
        console.log(this.addAreaArr);
        //添加的管理区域
        let areaStr = "";
        let villageStr = "";
        if (this.addAreaArr.length > 1) {
          for (var i = 0; i < this.addAreaArr.length; i++) {
            areaStr += this.addAreaArr[i].substring(this.addAreaArr[i].lastIndexOf(' ') + 1, this.addAreaArr[i].length) + '$';
          }
          villageStr = this.addAreaArr[0].substring(this.addAreaArr[0].lastIndexOf(' ') + 1, this.addAreaArr[0].length);
          areaStr = areaStr.substring(0, areaStr.length - 1);
        } else if (this.addAreaArr.length == 1) {
          areaStr = this.addAreaArr[0].substring(this.addAreaArr[0].lastIndexOf(' ') + 1, this.addAreaArr[0].length);
        } else if (this.addAreaArr.length == 0) {
          this.$notify({
            title: '创建失败',
            message: '添加的管理区域不能为空',
            type: 'warning',
            duration: 3000
          });
        }
        console.log(areaStr);
        console.log(villageStr);
        if (this.adminForm.confirmPass) {
          if(this.adminForm.confirmPass == this.adminForm.passWord){
             if (this.myRegion == '超级管理员') {
            this.createWoker({
              Name: this.adminForm.name,
              CardId: this.adminForm.IDNO,
              PhoneNumber: this.adminForm.account,
              PassWord: _this.hexSha1(_this.adminForm.passWord),
              // Region: this.checkedRegion[this.checkedRegion.length - 1],
              Region: areaStr,
              MyPhoneNumber: this.myPhoneNum,
              County: this.checkedRegion[0],
              Station: this.checkedRegion[1],
              // Villages: this.checkedRegion[3],
              Villages: villageStr,
              ToKen: this.token
            });
          } else {
            if (this.myCounty && this.myStation) {
              //保存工作站工作人员帐号
              this.createWoker({
                Name: this.adminForm.name,
                CardId: this.adminForm.IDNO,
                PhoneNumber: this.adminForm.account,
                PassWord: _this.hexSha1(_this.adminForm.passWord),
                // Region: this.checkedRegion[this.checkedRegion.length - 1],
                Region: areaStr,
                MyPhoneNumber: this.myPhoneNum,
                County: this.myCounty,
                Station: this.myStation,
                // Villages: this.checkedRegion[0],
                Villages: villageStr,
                ToKen: this.token
              });
            } else if (this.myCounty && !this.myStation) {
              //保存县级工作人员帐号
              this.createWoker({
                Name: this.adminForm.name,
                CardId: this.adminForm.IDNO,
                PhoneNumber: this.adminForm.account,
                PassWord: _this.hexSha1(_this.adminForm.passWord),
                // Region: this.checkedRegion[this.checkedRegion.length - 1],
                Region: areaStr,
                MyPhoneNumber: this.myPhoneNum,
                County: this.myCounty,
                Station: this.checkedRegion[0],
                // Villages: this.checkedRegion[1],
                Villages: villageStr,
                ToKen: this.token
              });
            }
          }
          }
        }else{
          this.$notify({
            title: '创建失败',
            message: '请检查密码后重试',
            type: 'warning',
            duration: 3000
          });
        }
      },
      //改变工作人员当前页
      workerCurrentChange(val) {
        this.fullscreenLoading = true;
        let newVal = (val - 1) * 10;
        this.chooseObj.Skip = newVal;
        this.searchWorker(this.chooseObj);
      },
      //根据身份证号或电话号码查询
      searchWorker: function(obj) {
        this.$http
          .post(this.serverIP + "/query/queryworkers", obj)
          .then(response => {
            console.log(response);
            if (response.data.errno == 0) {
              this.fullscreenLoading = false;
              this.handle = true;
              this.workersUser = response.data.data.workersUser;
              this.villageCount = response.data.data.count;
              this.countyCount = response.data.data.count;
              this.stationCount = response.data.data.count;
              for (var i = 0; i < this.workersUser.length; i++) {
                if (this.workersUser[i].villages === '') {
                  this.workersUser[i].transfer = false;
                } else {
                  this.workersUser[i].transfer = true;
                }
                //判断当前帐号的权限是否和列表里面工作人员权限相同
                this.workersUser[i].showEdit = true;
                if (this.workersUser[i].Jurisdiction == this.Jurisdiction) {
                  this.workersUser[i].showEdit = false;
                  console.log(this.workersUser[i].Name);
                }
                //判断用户角色
                if (this.workersUser[i].Jurisdiction == "1") {
                  this.workersUser[i].workerRole = "县级管理员";
                } else if (this.workersUser[i].Jurisdiction == "2") {
                  this.workersUser[i].workerRole = "社区工作站管理员";
                } else if (this.workersUser[i].Jurisdiction == "3") {
                  this.workersUser[i].workerRole = "社区工作人员";
                }
                //判断用户的登录权限
                if (this.workersUser[i].UserType == 2) {
                  if (this.workersUser[i].Region.indexOf("$") > -1) {
                    this.workersUser[i].Region = this.workersUser[i].Region.split('$');
                    let str = "";
                    for (var j = 0; j < this.workersUser[i].Region.length; j++) {
                      str += ' ( ' + this.workersUser[i].Region[j] + ' ) -';
                    }
                    this.workersUser[i].regionVillage = str.substring(0, str.length - 1);
                  } else {
                    this.workersUser[i].regionVillage = this.workersUser[i].Region;
                  }
                } else {
                  this.workersUser[i].regionVillage = this.workersUser[i].villages;
                }
              }
              this.pageTotal = response.data.data.count;
              this.pages = true;
            } else {
              this.fullscreenLoading = false;
              this.$notify({
                title: '查询失败',
                message: response.data.errmsg,
                type: 'warning',
                duration: 3000
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      //根据身份证号码或者电话号码查询工作人员
      searchBtn: function(num) {
        delete this.chooseObj.CardId;
        delete this.chooseObj.Phone;
        delete this.chooseObj.Name;
        delete this.chooseObj.Vague;
        if (this.form.accountNo !== "") {
          this.chooseObj.Vague = this.form.accountNo;
          console.log(this.chooseObj);
          this.searchWorker(this.chooseObj);
          this.currentPage = 1;
        } else {
          this.searchWorker(this.chooseObj);
          this.currentPage = 1;
        }
      }
    }
  };
</script>

<style lang="less">
  @import "../../table.less";
</style>
<style scoped>
  .passInfo {
    color: rgb(245, 8, 8);
  }
  .editBtns {
    display: flex !important;
    justify-content: center;
    padding: 20px 120px;
  }
  .manageBtn {
    margin-bottom: 20px;
  }
  .drugerNum {
    color: rgb(255, 0, 0);
    font-size: 16px !important;
    margin-bottom: 10px;
  }
  .currentPlace {
    display: inline-block;
    margin-right: 6px;
  }
  .chooseWorker {
    width: 75%;
  }
  .chooseWorker,
  .chooseWorker1,
  .chooseWorker2 {
    display: inline-block;
  }
  .chooseWorker1 {
    margin-left: 10px;
  }
  .villageChecked {
    height: 40px;
  }
  .villageChecked .el-radio {
    color: #fff;
  }
  .villageCount {
    color: #F56C6C;
  }
  .chooseValue {
    margin-right: 10px;
    display: inline-block;
  }
  .pages,
  .filterPages {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  .allotCount {
    line-height: 40px;
    margin-right: 16px;
  }
  .dialogFooter {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  .searchBox {
    width: 100%;
    text-align: center;
    margin: 30px 0;
  }
  .searchInput {
    width: 500px !important;
  }
  .drugerWrapper {
    width: 100%;
    overflow-x: hidden;
    height: 360px;
    overflow-y: auto;
    margin-bottom: 20px;
  }
  .searchInput,
  .searchBtn {
    display: inline-block;
  }
  .searchBtn {
    margin-left: 10px !important;
  }
  .searchTable {
    position: relative;
  }
  .noData {
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    position: absolute;
    top: 45px;
    left: 0;
    font-size: 14px;
    z-index: 9;
    color: #979B9F;
  }
  .el-cascader {
    width: 100%;
  }
  .addArea {
    border: 1px solid #dcdfe6;
    padding: 20px 10px;
    border-radius: 4px;
  }
  .addArea li {
    display: block;
    margin: 0 10px;
    cursor: pointer;
  }
</style>
