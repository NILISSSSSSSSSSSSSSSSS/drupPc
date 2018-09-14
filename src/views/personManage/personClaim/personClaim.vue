<template>
    <div class="chooseRole">
        <div v-show="showBack"><el-button type="primary" size="medium" class="backBtn" icon="el-icon-arrow-left" @click="backBtn">返回</el-button></div>
        <el-tabs v-model="chooseActive" type="card" @tab-click="handleChoose">
            <el-tab-pane label="人员核实" name="first">
                <!--人员核实-->
                <h3 class="info">当前待核实人数为: <b>{{shelterCount}}</b> 人</h3>
                <ul class="shelters">
                    <li v-for="(item,index) in shelters" :key="index">
                        <span class="shelterList">{{item.Name}}</span>
                        <el-button type="primary" size="small" @click="goClaim(index)">确定</el-button>
                        <el-button size="small" @click="goReject(index)">回退</el-button>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane label="报到/登记" name="second">
                <!--报到/登记-->
                <div class="handleRegister" v-show="handleRegister">
                    <el-button type="primary" icon="el-icon-edit" @click="handleTypeIn">手动录入人员</el-button>
                </div>
                <div class="drugerStatus">
                   <!--  <el-checkbox-group v-model="drugerStatus" @change="chooseBasicStatus">
                        <el-checkbox label="待报到"></el-checkbox>
                        <el-checkbox label="已报到"></el-checkbox>
                        <el-checkbox label="确定逾期"></el-checkbox>
                    </el-checkbox-group> -->
                    <div class="chooseDrugerState" v-show="showRegisterState">
                    <el-radio-group v-model="registerDrugerState" @change="chooseBasicStatus">
                        <el-radio :label="0">查看全部</el-radio>
                        <el-radio :label="1">待报到</el-radio>
                        <el-radio :label="2">已报到</el-radio>
                        <el-radio :label="3">确定逾期</el-radio>
                    </el-radio-group>
                    </div>
                </div>
                <div class="searchTable">
                <el-table :data="registerDrugerList" border style="width: 100%">
                    <el-table-column label="姓名" width="180">
                        <template slot-scope="scope">
                         <span>{{ scope.row.Name}}</span>
                        </template>
                    </el-table-column>
                   <el-table-column label="身份证号码">
                        <template slot-scope="scope">
                         <span>{{ scope.row.Card_Id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="户籍地址">
                        <template slot-scope="scope">
                         <span>{{ scope.row.PermanentAddress}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="人员类型">
                        <template slot-scope="scope">
                         <span>{{ scope.row.Drugategory}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-button size="mini" :type="scope.row.btnState" @click="hanleStatus(scope.$index, scope.row)">{{scope.row.statusText}}</el-button>
                        </template>
                  </el-table-column>
                </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--人员核实确定弹窗-->
        <el-dialog title="人员认领" :visible.sync="shelterClaimVisible" :append-to-body="true">
            <div class="claimWrapper">
                <el-form :model="shelterClaim">
                    <el-form-item label="决定单位" :label-width="formLabelWidth">
                        <el-input v-model="shelterClaim.DeterminingUnit" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="决定日期" :label-width="formLabelWidth">
                        <el-date-picker v-model="shelterClaim.DeterminingTime" type="date" placeholder="请选择日期" :picker-options="pickNowTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="人员类别" :label-width="formLabelWidth">
                        <span>{{drugerType}}</span>
                    </el-form-item>
                    <el-form-item label="法律文书编号" :label-width="formLabelWidth">
                        <el-input v-model="shelterClaim.LawBookNumber" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="决定书照片" :label-width="formLabelWidth">
                        <el-upload class="upload-demo" ref="upload" action="" :on-remove="getFile" :on-change="getFile" :file-list="shelterClaim.fileList" :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="shelterClaimVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </div>
        </el-dialog>
        <!--人员核实回退弹窗-->
        <el-dialog title="人员回退" :visible.sync="shelterRejectVisible" :append-to-body="true">
            <el-form :model="shelterReject">
                <el-form-item label="回退原因" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" placeholder="请输入回退原因" v-model="shelterReject.Reason">
                    </el-input>
                </el-form-item>
                <el-form-item label="回退地点" :label-width="formLabelWidth">
                    <el-cascader :options="areaArr" v-model="rejectOptions" @change="rejectPlaceChange" :props="props" style="width:100%;">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="shelterRejectVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRejectForm">确 定</el-button>
            </div>
        </el-dialog>
        <!--手动录入人员弹窗-->
        <el-dialog title="手动录入人员" :visible.sync="RegisterDrugerVisible" :append-to-body="true">
            <div class="claimWrapper">
            <el-form :model="typeInRegisterDruger">
                 <el-form-item label="近期照片" :label-width="formLabelWidth" required>
                    <el-upload class="upload-demo" ref="upload" action="" :on-remove="getHeadImageUrl" :on-change="getHeadImageUrl" :file-list="typeInRegisterDruger.HeadImageUrl" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.DrugUserName" auto-complete="off" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.DrugUserCardId" :maxlength="18" auto-complete="off"  placeholder="请输入身份证号码"></el-input>
                </el-form-item>
                <el-form-item label="曾用名" :label-width="formLabelWidth">
                    <el-input v-model="typeInRegisterDruger.OldName" auto-complete="off"  placeholder="请输入曾用名"></el-input>
                </el-form-item>
                 <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-radio-group v-model="checkedSex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="民族" :label-width="formLabelWidth">
                    <el-select v-model="nationValue" placeholder="请选择民族">
                        <el-option v-for="item in nationArr" :key="item.nationValue" :label="item.label" :value="item.nationValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="户籍详细地址" :label-width="formLabelWidth">
                    <el-input v-model="typeInRegisterDruger.PermanentAddress" auto-complete="off"  placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="居住地地址" :label-width="formLabelWidth" required>
                    <al-cascader v-model="livePlace1" />
                </el-form-item>
                 <el-form-item label="居住地详细地址" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.detailPlace" auto-complete="off"  placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="文化程度" :label-width="formLabelWidth" required>
                    <el-select v-model="cultureValue" placeholder="请选择">
                        <el-option v-for="item in cultureArr" :key="item.cultureValue" :label="item.label" :value="item.cultureValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职业" :label-width="formLabelWidth" required>
                    <el-select v-model="occupationValue" placeholder="请选择">
                        <el-option v-for="item in occupationArr" :key="item.occupationValue" :label="item.label" :value="item.occupationValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.DrugPhoneNumber" :maxlength="11" auto-complete="off"  placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="决定书照片" :label-width="formLabelWidth" required>
                    <el-upload class="upload-demo" ref="upload" action="" :on-remove="getDecisionPhoto" :on-change="getDecisionPhoto" :file-list="typeInRegisterDruger.DecisionPhoto" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="决定单位" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.DeterminingUnit" auto-complete="off"  placeholder="请输入决定单位"></el-input>
                </el-form-item>
                <el-form-item label="决定日期" :label-width="formLabelWidth" required>
                    <el-date-picker v-model="typeInRegisterDruger.DeterminingTime" type="date" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="人员类别" :label-width="formLabelWidth" required>
                    <el-select v-model="drugerTypeValue" placeholder="请选择人员类别">
                        <el-option v-for="item in drugerTypeArr" :key="item.drugerTypeValue" :label="item.label" :value="item.drugerTypeValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="法律文书编号" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.LawBookNumber" auto-complete="off"  placeholder="请输入编号"></el-input>
                </el-form-item>
                <el-form-item label="报到日期" :label-width="formLabelWidth" required>
                    <el-date-picker v-model="typeInRegisterDruger.ReportDate" type="date" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="社区戒毒开始日期" :label-width="formLabelWidth" required>
                    <el-date-picker v-model="typeInRegisterDruger.RehabilitativeStartDate" type="date" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="社区戒毒结束日期" :label-width="formLabelWidth" required>
                    <el-date-picker v-model="typeInRegisterDruger.RehabilitativeEndDate" type="date" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="协议照片" :label-width="formLabelWidth" required>
                    <el-upload class="upload-demo" ref="upload" action="" :on-remove="getRrotocolPhoto" :on-change="getRrotocolPhoto" :file-list="typeInRegisterDruger.RrotocolPhoto" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="RegisterDrugerVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitTypeInDruger">确 定</el-button>
            </div>
        </el-dialog>
        <!--完善人员信息弹窗-->
        <el-dialog title="完善人员信息" :visible.sync="perfectInfoVisible" :append-to-body="true">
            <div class="claimWrapper">
            <el-form :model="typeInRegisterDruger">
                 <el-form-item label="近期照片" :label-width="formLabelWidth" required>
                    <el-upload class="upload-demo" ref="upload" action="" :on-remove="getHeadImageUrl" :on-change="getHeadImageUrl" :file-list="typeInRegisterDruger.HeadImageUrl" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.DrugUserName"  auto-complete="off" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.DrugUserCardId" :maxlength="18" auto-complete="off"  placeholder="请输入身份证号码"></el-input>
                </el-form-item>
                <el-form-item label="曾用名" :label-width="formLabelWidth">
                    <el-input v-model="typeInRegisterDruger.OldName" auto-complete="off"  placeholder="请输入曾用名"></el-input>
                </el-form-item>
                 <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-radio-group v-model="checkedSex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="民族" :label-width="formLabelWidth">
                    <el-select v-model="nationValue" placeholder="请选择民族">
                        <el-option v-for="item in nationArr" :key="item.nationValue" :label="item.label" :value="item.nationValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="户籍详细地址" :label-width="formLabelWidth">
                    <el-input v-model="typeInRegisterDruger.PermanentAddress" auto-complete="off"  placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="居住地地址" :label-width="formLabelWidth" required>
                    <al-cascader v-model="livePlace" />
                </el-form-item>
                 <el-form-item label="居住地详细地址" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.detailPlace" auto-complete="off"  placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="文化程度" :label-width="formLabelWidth" required>
                    <el-select v-model="cultureValue" placeholder="请选择">
                        <el-option v-for="item in cultureArr" :key="item.cultureValue" :label="item.label" :value="item.cultureValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职业" :label-width="formLabelWidth" required>
                    <el-select v-model="occupationValue" placeholder="请选择">
                        <el-option v-for="item in occupationArr" :key="item.occupationValue" :label="item.label" :value="item.occupationValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth" required>
                    <el-input v-model="typeInRegisterDruger.DrugPhoneNumber" :maxlength="11" auto-complete="off"  placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="报到日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="typeInRegisterDruger.ReportDate" type="date" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="社区戒毒开始日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="typeInRegisterDruger.RehabilitativeStartDate" type="date" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="社区戒毒结束日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="typeInRegisterDruger.RehabilitativeEndDate" type="date" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="协议照片" :label-width="formLabelWidth">
                    <el-upload class="upload-demo" ref="upload" action="" :on-remove="getRrotocolPhoto" :on-change="getRrotocolPhoto" :file-list="typeInRegisterDruger.RrotocolPhoto" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="perfectInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitPerfectInfo">确 定</el-button>
            </div>
        </el-dialog>
        <!--已报到人员信息弹窗-->
        <el-dialog title="完善人员信息" :visible.sync="reportedVisible" :append-to-body="true">
            <div class="claimWrapper">
            <el-form :model="reportedDruger">
                 <el-form-item label="近期照片" :label-width="formLabelWidth">
                    <div class="imgs">
                          <img :src="item" v-cosauth v-for="(item,index) in reportedDruger.HeadImageUrlArr" width="100px" height="100px" @click="viewPhoto(index,0)" :key="item"/>
                    </div>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <span>{{reportedDruger.Name}}</span>
                </el-form-item>
                <el-form-item label="身份证号码" :label-width="formLabelWidth">
                    <span>{{reportedDruger.Card_Id}}</span>
                </el-form-item>
                <el-form-item label="曾用名" :label-width="formLabelWidth">
                    <span>{{reportedDruger.OldName}}</span>
                </el-form-item>
                 <el-form-item label="性别" :label-width="formLabelWidth">
                    <span>{{reportedDruger.Sex}}</span>
                </el-form-item>
                <el-form-item label="民族" :label-width="formLabelWidth">
                    <span>{{reportedDruger.Ethnicity}}</span>
                </el-form-item>
                <el-form-item label="户籍详细地址" :label-width="formLabelWidth">
                    <span>{{reportedDruger.PermanentAddress}}</span>
                </el-form-item>
<!--                 <el-form-item label="居住地地址" :label-width="formLabelWidth">
                    <al-cascader v-model="livePlace" />
                    ResidentialAddress
                </el-form-item> -->
                 <el-form-item label="居住地详细地址" :label-width="formLabelWidth">
                     <span>{{reportedDruger.ResidentialAddress}}</span>
                </el-form-item>
                <el-form-item label="文化程度" :label-width="formLabelWidth">
                    <span>{{reportedDruger.Culture}}</span>
                </el-form-item>
                <el-form-item label="职业" :label-width="formLabelWidth">
                    <span>{{reportedDruger.Occupation}}</span>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth">
                    <span>{{reportedDruger.PhoneNumber}}</span>
                </el-form-item>
                <el-form-item label="报到日期" :label-width="formLabelWidth">
                     <span>{{reportedDruger.ReportDate}}</span>
                </el-form-item>
                <el-form-item label="社区戒毒开始日期" :label-width="formLabelWidth">
                     <span>{{reportedDruger.RehabilitativeStartDate}}</span>
                </el-form-item>
                <el-form-item label="社区戒毒结束日期" :label-width="formLabelWidth">
                    <span>{{reportedDruger.RehabilitativeEndDate}}</span>
                </el-form-item>
                 <el-form-item label="协议照片" :label-width="formLabelWidth">
                    <div class="imgs">
                          <img :src="item" v-cosauth v-for="(item,index) in reportedDruger.RrotocolPhotoArr" width="100px" height="100px" @click="viewPhoto(index,1)" :key="item"/>
                    </div>
                </el-form-item>
            </el-form>
            </div>
        </el-dialog>
        <!--预览图片-->
        <el-dialog :visible.sync="viewImgVisible" :append-to-body="true" width="50%">
        <img :src="showImg" width="100%" height="500px" v-cosauth>
        </el-dialog>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import messageData from '../../../assets/region/message.json';
    var _this;
    export default {
        name: "personClaim",
        data() {
            return {
                chooseActive: "first",
                pickNowTime: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                regionData:messageData,
                btnState:"danger",
                showBack:false,
                registerDrugerState:0,
                showImg:null,
                viewImgVisible:false,
                reportedDruger:{},
                perfectInfoVisible:false,
                livePlace:[],
                livePlace1:[],
                drugerTypeValue:"",
                drugerTypeArr:[{
                    label:"社区戒毒",
                    drugerTypeValue:"社区戒毒"
                },{
                    label:"社区康复",
                    drugerTypeValue:"社区康复"
                }],
                handleRegister:true,
                showRegisterState:false,
                showWorkerTypeIn:true,
                occupationValue:"",
                occupationArr:[{
                    label:"无业人员",
                    occupationValue:"无业人员"
                },{
                    label:"个体经营者",
                    occupationValue:"个体经营者"
                },{
                    label:"自由职业者",
                    occupationValue:"自由职业者"
                },{
                    label:"职员",
                    occupationValue:"职员"
                },{
                    label:"离（退）休人员",
                    occupationValue:"离（退）休人员"
                },{
                    label:"农民",
                    occupationValue:"农民"
                },{
                    label:"学生",
                    occupationValue:"学生"
                },{
                    label:"工人",
                    occupationValue:"工人"
                },{
                    label:"国家机关事业单位人员",
                    occupationValue:"国家机关事业单位人员"
                },{
                    label:"企事业单位人员",
                    occupationValue:"企事业单位人员"
                },{
                    label:"医生",
                    occupationValue:"医生"
                },{
                    label:"护士",
                    occupationValue:"护士"
                },{
                    label:"教师",
                    occupationValue:"教师"
                },{
                    label:"律师",
                    occupationValue:"律师"
                },{
                    label:"其他",
                    occupationValue:"其他"
                }],
                cultureValue:"",
                cultureArr:[{
                    label:"文盲或半文盲",
                    cultureValue:"文盲或半文盲"
                },{
                    label:"小学教育",
                    cultureValue:"小学教育"
                },{
                    label:"初级中学教育",
                    cultureValue:"初级中学教育"
                },{
                    label:"普通高级中学教育",
                    cultureValue:"普通高级中学教育"
                },{
                    label:"中等职业教育",
                    cultureValue:"中等职业教育"
                },{
                    label:"大学专科教育",
                    cultureValue:"大学专科教育"
                },{
                    label:"大学本科教育",
                    cultureValue:"大学本科教育"
                },{
                    label:"研究生教育",
                    cultureValue:"研究生教育"
                },{
                    label:"其他",
                    cultureValue:"其他"
                }],
                nationValue:"",
                ResidentialAddress:"",
                nationArr:[
                    {
                        nationValue:"汉族",
                        label:"汉族"
                    },
                    {
                        nationValue:"蒙古族",
                        label:"蒙古族"
                    },
                    {
                        nationValue:"回族",
                        label:"回族"
                    },
                     {
                        nationValue:"藏族",
                        label:"藏族"
                    },
                    {
                        nationValue:"维吾尔族",
                        label:"维吾尔族"
                    },
                    {
                        nationValue:"苗族",
                        label:"苗族"
                    },
                     {
                        nationValue:"彝族",
                        label:"彝族"
                    },
                    {
                        nationValue:"壮族",
                        label:"壮族"
                    },
                    {
                        nationValue:"布依族",
                        label:"布依族"
                    },
                    {
                        nationValue:"朝鲜族",
                        label:"朝鲜族"
                    },
                    {
                        nationValue:"满族",
                        label:"满族"
                    },
                     {
                        nationValue:"侗族",
                        label:"侗族"
                    },
                     {
                        nationValue:"瑶族",
                        label:"瑶族"
                    },
                     {
                        nationValue:"白族",
                        label:"白族"
                    },
                     {
                        nationValue:"土家族",
                        label:"土家族"
                    },
                    {
                        nationValue:"哈尼族",
                        label:"哈尼族"
                    },
                    {
                        nationValue:"哈萨克族",
                        label:"哈萨克族"
                    },
                     {
                        nationValue:"傣族",
                        label:"傣族"
                    },
                     {
                        nationValue:"黎族",
                        label:"黎族"
                    },
                    {
                        nationValue:"傈僳族",
                        label:"傈僳族"
                    },
                    {
                        nationValue:"佤族",
                        label:"佤族"
                    },
                    {
                        nationValue:"畲族",
                        label:"畲族"
                    },
                    {
                        nationValue:"高山族",
                        label:"高山族"
                    },
                    {
                        nationValue:"拉祜族",
                        label:"拉祜族"
                    },
                    {
                        nationValue:"水族",
                        label:"水族"
                    },
                    {
                        nationValue:"东乡族",
                        label:"东乡族"
                    },
                     {
                        nationValue:"纳西族",
                        label:"纳西族"
                    },
                    {
                        nationValue:"景颇族",
                        label:"景颇族"
                    },
                     {
                        nationValue:"柯尔克孜族",
                        label:"柯尔克孜族"
                    },
                     {
                        nationValue:"土族",
                        label:"土族"
                    },
                    {
                        nationValue:"达斡尔族",
                        label:"达斡尔族"
                    },
                     {
                        nationValue:"仫佬族",
                        label:"仫佬族"
                    },
                    {
                        nationValue:"羌族",
                        label:"羌族"
                    },
                    {
                        nationValue:"布朗族",
                        label:"布朗族"
                    },
                     {
                        nationValue:"撒拉族",
                        label:"撒拉族"
                    },
                     {
                        nationValue:"毛难族",
                        label:"毛难族"
                    },
                     {
                        nationValue:"仡佬族",
                        label:"仡佬族"
                    },
                    {
                        nationValue:"锡伯族",
                        label:"锡伯族"
                    },
                    {
                        nationValue:"阿昌族",
                        label:"阿昌族"
                    },
                    {
                        nationValue:"普米族",
                        label:"普米族"
                    },
                     {
                        nationValue:"塔吉克族",
                        label:"塔吉克族"
                    },
                     {
                        nationValue:"怒族",
                        label:"怒族"
                    },
                     {
                        nationValue:"乌孜别克族",
                        label:"乌孜别克族"
                    },
                     {
                        nationValue:"俄罗斯族",
                        label:"俄罗斯族"
                    },
                     {
                        nationValue:"鄂温克族",
                        label:"鄂温克族"
                    },
                    {
                        nationValue:"崩龙族",
                        label:"崩龙族"
                    },
                     {
                        nationValue:"保安族",
                        label:"保安族"
                    },
                    {
                        nationValue:"裕固族",
                        label:"裕固族"
                    },
                     {
                        nationValue:"京族",
                        label:"京族"
                    },
                    {
                        nationValue:"塔塔尔族",
                        label:"塔塔尔族"
                    },
                     {
                        nationValue:"独龙族",
                        label:"独龙族"
                    },
                    {
                        nationValue:"鄂伦春族",
                        label:"鄂伦春族"
                    },
                    {
                        nationValue:"赫哲族",
                        label:"赫哲族"
                    },
                    {
                        nationValue:"门巴族",
                        label:"门巴族"
                    },
                    {
                        nationValue:"珞巴族",
                        label:"珞巴族"
                    },
                    {
                        nationValue:"基诺族",
                        label:"基诺族"
                    }],
                checkedSex:4,
                statusText:"",
                drugerStatus: ['待报到', '已报到', '确定逾期'],
                rejectOptions: [],
                token: "",
                myPhoneNum: "",
                shelterCount: 0,
                shelterClaimVisible: false,
                shelterRejectVisible: false,
                formLabelWidth: '200px',
                shelterReject: {
                    Reason: ""
                },
                typeInRegisterDruger:{
                   /*  DrugUserName:"",
                    DrugUserCardId:"",
                    OldName:"",
                    DeterminingTime:"",
                    DrugPhoneNumber:"",
                    PermanentAddress:"",
                    detailPlace:"",
                    DeterminingUnit:"",
                    LawBookNumber:"",
                    HeadImageUrl:[],
                    RrotocolPhoto:[],
                    RehabilitativeStartDate:"",
                    RehabilitativeEndDate:"",
                    DecisionPhoto:[] */
                },
                reportedVisible:false,
                RegisterDrugerVisible:false,
                props: {
                    value: 'label'
                },
                registerDrugerList:[],
                rejectPlace: "",
                rejectDrugerName: "",
                rejectDrugerCardId: "",
                drugerName: "",
                drugerType: "",
                shelterClaim: {
                    /* DeterminingUnit: '',
                    DeterminingTime: '',
                    LawBookNumber: '',
                    fileList: [], */
                },
                chooseState:"",
                drugerCardId:"",
                getDrugerCardId:"",
                areaArr: [],
                shelters: []
            }
        },
        created() {
            //获取token
            _this = this;
            this.token = Cookies.get('myToken');
            //获取登录手机号码
            this.myPhoneNum = Cookies.get('myPhoneNum');
            //进入页面加载
            this.chooseState = this.$route.query.chooseState;
            this.getDrugerCardId = this.$route.query.drugerId;
            if(this.chooseState){
                //通过路由跳转的
                this.handleRegister = false;
                this.showRegisterState = false;
                this.showBack = true;
                this.chooseActive = this.chooseState;
                if(this.chooseActive == "first"){
                    this.showShelter({
                    ToKen: this.token,
                    DrugerCardId:this.getDrugerCardId,
                    PhoneNumber: this.myPhoneNum
                 });
                }else if(this.chooseActive == "second"){
                     this.registerDrugerState = 0;
                     this.showRegisterDruger({
                        ToKen: this.token,
                        DrugerCardId:this.getDrugerCardId,
                        PhoneNumber: this.myPhoneNum
                      },10);
                }
            }else{
                //没有通过路由跳转的
                this.handleRegister = true;
                this.showRegisterState = true;
                this.showBack = false;
                 this.showShelter({
                    ToKen: this.token,
                    PhoneNumber: this.myPhoneNum
                });
            }
            //获取管理区域json文件
            this.areaArr = this.regionData;
            /* this.$http.get(this.serverIP + '/query/message').then(response => {
                this.areaArr = response.data;
            }, response => {
                console.log('error');
            }); */
            this.Tool.newCos(this.myPhoneNum,this.token);
        },
        methods: {
            //选择切换
            handleChoose: function(tab) {
               if(this.chooseState){
                   this.handleRegister = false;
                   this.showRegisterState = false;
                   if (tab.label == "人员核实") {
                    this.showShelter({
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum,
                        DrugerCardId:this.getDrugerCardId
                    });
                  } else if (tab.label == "报到/登记") {
                    console.log('报到');
                    this.registerDrugerState = 0;
                    this.showRegisterDruger({
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum,
                        DrugerCardId:this.getDrugerCardId
                      },10);
                }
               }else{
                   this.handleRegister = true;
                  this.showRegisterState = true;
                 if (tab.label == "人员核实") {
                    this.showShelter({
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum
                    });
                } else if (tab.label == "报到/登记") {
                    console.log('报到');
                    this.registerDrugerState = 0;
                    this.showRegisterDruger({
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum
                      },10);
                }
               }
            },
            //返回上一页
            backBtn:function(){
                this.$router.go(-1);
            },
            //选择改变
            chooseBasicStatus:function(value){
               if(value == 0){
                   console.log(0);
                   this.showRegisterDruger({
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum
                    },10);
               }else if(value == 1){
                   console.log(1111);
                    this.showRegisterDruger({
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum
                    },0);
               }else if (value == 2){
                   console.log(222)
                  this.showRegisterDruger({
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum
                    },2);
               }else if(value == 3){
                   console.log(333);
                  this.showRegisterDruger({
                        ToKen: this.token,
                        PhoneNumber: this.myPhoneNum
                    },3);
               }
            },
             //放大图片
           viewPhoto:function(index,type){
               this.viewImgVisible = true;
            //    console.log(index);
               if(type == 0){
                   //近期照片
                  this.showImg = this.reportedDruger.HeadImageUrlArr[index];
               }else if(type == 1){
                   //协议照片
                  this.showImg = this.reportedDruger.RrotocolPhotoArr[index];
               }
           },
            //回退地点改变
            rejectPlaceChange: function(value) {
                this.rejectPlace = value;
            },
            //回退人员确定
            submitRejectForm: function() {
                this.$http
                    .post(this.httpUrl + "/home/query/returnusers", {
                        PhoneNumber: this.myPhoneNum,
                        ToKen: this.token,
                        DrugerCardId: this.rejectDrugerCardId,
                        DrugerName: this.rejectDrugerName,
                        Reason: this.shelterReject.Reason,
                        county: this.rejectPlace[0],
                        station: this.rejectPlace[1],
                        villages: this.rejectPlace[2]
                    }).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.$notify({
                                title: '回退成功',
                                message: response.data.errmsg,
                                type: 'success',
                                duration: 3000
                            });
                            this.shelterRejectVisible = false;
                            //刷新页面
                           /*  this.showShelter({
                                ToKen: this.token,
                                PhoneNumber: this.myPhoneNum
                            }); */
                            if(_this.chooseState){
                                //有路由跳转的
                                // console.log('回退刷新有路由跳转');
                                _this.showBack = true;
                                _this.showShelter({
                                    ToKen: _this.token,
                                    DrugerCardId:_this.getDrugerCardId,
                                    PhoneNumber: _this.myPhoneNum
                                });
                                this.shelterClaim = {};
                            }else{
                                // console.log('回退刷新无路由跳转');
                                _this.showBack = false;
                                _this.showShelter({
                                    ToKen: _this.token,
                                    PhoneNumber: _this.myPhoneNum
                                });
                                this.shelterClaim = {};
                           }
                        } else {
                            this.$notify({
                                title: '回退失败',
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
            //加载报到/登记人员名单
            showRegisterDruger: function(obj,filterValue) {
                this.$http
                    .post(this.httpUrl + "/home/query/getdruguserreportlist", obj)
                    .then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.registerDrugerList = response.data.data.druguser;
                            for(var i = 0;i<this.registerDrugerList.length;i++){
                                switch(this.registerDrugerList[i].status){
                                    case 0 :
                                     //待登记-待报到
                                     this.registerDrugerList[i].statusText = "待登记";
                                     this.registerDrugerList[i].btnState = "danger";
                                     break;
                                     case 1:
                                     this.registerDrugerList[i].statusText = "逾期未报到";
                                     this.registerDrugerList[i].btnState = "danger";
                                     break;
                                     case 2:
                                     this.registerDrugerList[i].statusText = "已报到";
                                     this.registerDrugerList[i].btnState = "success";
                                     break;
                                     case 3:
                                     this.registerDrugerList[i].statusText = "确定逾期";
                                     this.registerDrugerList[i].btnState = "danger";
                                     break;
                                     case 4:
                                     this.registerDrugerList[i].statusText = "工作人员确定未逾期";
                                     this.registerDrugerList[i].btnState = "danger";
                                }
                            }
                            if(filterValue == 0){
                                this.registerDrugerList = this.registerDrugerList.filter((item) => {
                                    return item.status == 0;
                                });
                            }else if(filterValue == 2){
                                 this.registerDrugerList = this.registerDrugerList.filter((item) => {
                                    return item.status == 2;
                                });
                            }else if(filterValue == 3){
                                 this.registerDrugerList = this.registerDrugerList.filter((item) => {
                                    return item.status == 3;
                                });
                            }else if(filterValue == 10){
                                this.registerDrugerList = response.data.data.druguser;
                            }
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
            //加载待核实人员名单
            showShelter: function(obj) {
                this.$http
                    .post(this.httpUrl + "/home/query/getdruguser", obj).then(response => {
                        console.log(response);
                        if (response.data.errno == 0) {
                            this.shelters = response.data.data.users;
                            this.shelterCount = response.data.data.users.length;
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
            //手动录入人员
            handleTypeIn: function() {
                this.showWorkerTypeIn = true;
                this.RegisterDrugerVisible = true;
                this.hanleTypeIn = true;
                this.hanlePerfectInfo = false;
                this.typeInRegisterDruger = {};
                this.occupationValue = "";
                this.cultureValue = "";
                this.nationValue = "";
                this.checkedSex = 4;
            },
            //点击人员报到/登记状态
            hanleStatus:function(index,row){
                // console.log(row);
                switch (row.status){
                    case 0:
                    //待登记
                    this.perfectInfoVisible = true;
                    this.typeInRegisterDruger.DrugUserName = row.Name;
                    this.typeInRegisterDruger.DrugUserCardId = row.Card_Id;
                    this.typeInRegisterDruger.PermanentAddress = row.PermanentAddress;
                    // console.log('待登记');
                    break;
                    case 1:
                    //逾期未报到
                    // console.log('逾期未报到跳转');
                    this.$router.push({
                        path: '/typeIn',
                        query:{
                            drugerId:this.$route.query.drugerId
                        }
                    });
                    break;
                    case 2:
                    // console.log('已经报到');
                    this.reportedVisible = true;
                    this.reportedDruger = row;
                    this.reportedDruger.ReportDate = this.reportedDruger.ReportDate.split(" ")[0];
                    this.reportedDruger.RehabilitativeStartDate = this.reportedDruger.RehabilitativeStartDate.split(" ")[0];
                    this.reportedDruger.RehabilitativeEndDate = this.reportedDruger.RehabilitativeEndDate.split(" ")[0];
                    if(this.reportedDruger.Sex == 1){
                        this.reportedDruger.Sex = "男"; 
                    }else if(this.reportedDruger.Sex == 2){
                        this.reportedDruger.Sex = "女";
                    }
                    this.reportedDruger.RrotocolPhotoArr = [];
                    this.reportedDruger.HeadImageUrlArr = [];
                    //协议照片
                    if(this.reportedDruger.RrotocolPhoto){
                      if(this.reportedDruger.RrotocolPhoto.indexOf("$@")>-1){
                        this.reportedDruger.RrotocolPhotoArr = this.reportedDruger.RrotocolPhoto.split("$@");
                        }else{
                            this.reportedDruger.RrotocolPhotoArr.push(this.reportedDruger.RrotocolPhoto);
                        }
                    }
                    //近期照片
                    if(this.reportedDruger.HeadImageUrl){
                      if(this.reportedDruger.HeadImageUrl.indexOf("$@")>-1){
                        this.reportedDruger.HeadImageUrlArr = this.reportedDruger.HeadImageUrl.split("$@");
                        }else{
                            this.reportedDruger.HeadImageUrlArr.push(this.reportedDruger.HeadImageUrl);
                        }
                    }
                    break;
                    case 3:
                    console.log('确定逾期');
                    break;
                    case 4:
                    console.log('工作人员确定未逾期');
                    break;
                }
            },
            //人员核实确定
            goClaim: function(index) {
                this.shelterClaimVisible = true;
                // console.log(this.shelters[index]);
                this.drugerName = this.shelters[index].Name;
                this.drugerCardId = this.shelters[index].Card_Id;
                // console.log(this.drugerCardId);
                this.drugerType = this.shelters[index].Drugategory;
            },
            //人员核实回退
            goReject: function(index) {
                this.shelterRejectVisible = true;
                // console.log(this.shelters[index]);
                this.rejectDrugerName = this.shelters[index].Name;
                this.rejectDrugerCardId = this.shelters[index].Card_Id;
            },
            //时间格式转换
            formatTime: function(ms) {
                var date = new Date(ms);
                var year, month, day, hour, min, second;
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                hour = date.getHours();
                min = date.getMinutes();
                second = date.getSeconds();
                month < 10 ? (month = '0' + month) : month;
                day < 10 ? (day = '0' + day) : day;
                hour < 10 ? (hour = '0' + hour) : hour;
                min < 10 ? (min = '0' + min) : min;
                second < 10 ? (second = '0' + second) : second;
                return `${year}-${month}-${day}`;
            },
            //确定提交手动录入人员信息
            submitTypeInDruger:function(){
                if(this.typeInRegisterDruger.HeadImageUrl == [] || !this.typeInRegisterDruger.DrugUserName || !this.typeInRegisterDruger.DrugUserCardId || 
                !this.typeInRegisterDruger.DrugPhoneNumber || !this.typeInRegisterDruger.PermanentAddress || !this.typeInRegisterDruger.detailPlace || this.typeInRegisterDruger.RrotocolPhoto ==[] ){
                     this.$notify({
                                title: '保存失败',
                                message: '请检查是否填写完整后再提交',
                                type: 'warning',
                                duration: 3000
                        });
                }
                console.log(this.livePlace1);
                this.ResidentialAddress =`${this.livePlace1[0].name}-${this.livePlace1[1].name}-${this.livePlace1[2].name}-${this.livePlace1[3].name}-${this.typeInRegisterDruger.detailPlace}`;
                var picList = {
                    HeadImageUrl:this.typeInRegisterDruger["HeadImageUrl"],
                    RrotocolPhoto: this.typeInRegisterDruger["RrotocolPhoto"],
                    DecisionPhoto: this.typeInRegisterDruger["DecisionPhoto"]
                };
                var uploadData = {
                    PhoneNumber:this.myPhoneNum,
                    ToKen:this.token,
                    DrugUserCardId:this.typeInRegisterDruger.DrugUserCardId,
                    DrugUserName:this.typeInRegisterDruger.DrugUserName,
                    OldName:this.typeInRegisterDruger.OldName,
                    Sex:this.checkedSex,
                    Ethnicity:this.nationValue,
                    PermanentAddress:this.typeInRegisterDruger.PermanentAddress,
                    ResidentialAddress:this.ResidentialAddress,
                    Culture: this.cultureValue,
                    Occupation:this.occupationValue,
                    DrugPhoneNumber:this.typeInRegisterDruger.DrugPhoneNumber,
                    ReportDate:this.formatTime(this.typeInRegisterDruger.ReportDate),
                    RehabilitativeStartDate:this.formatTime(this.typeInRegisterDruger.RehabilitativeStartDate),
                    RehabilitativeEndDate:this.formatTime(this.typeInRegisterDruger.RehabilitativeEndDate),
                    DeterminingUnit:this.typeInRegisterDruger.DeterminingUnit,
                    DeterminingTime:this.formatTime(this.typeInRegisterDruger.DeterminingTime),
                    Drugategory:this.drugerTypeValue,
                    LawBookNumber:this.typeInRegisterDruger.LawBookNumber
                };
                var params_myUpload = {
                    fileType: "pic",
                    fileList: picList
                };
                var params_postForm = {
                    url: "/backstage/index/pcnewpersonnelupload",
                    data: uploadData,
                    success: function(res) {
                        console.log(res);
                        console.log('成功');
                        _this.$notify({
                                title: '手动录入人员成功',
                                message: res.data.data,
                                type: 'success',
                                duration: 3000
                        });
                        _this.RegisterDrugerVisible = false;
                        //  _this.resetForm(typeInRegisterDruger);
                        //刷新
                        /* _this.registerDrugerState = 0;
                        _this.showRegisterDruger({
                        ToKen: _this.token,
                        PhoneNumber: _this.myPhoneNum
                      },10); */
                       if(_this.chooseState){
                          //有路由跳转的
                          console.log('有路由');
                           _this.showRegisterState = false;
                           _this.showBack = true;
                           _this.showRegisterDruger({
                                ToKen: _this.token,
                                DrugerCardId:_this.getDrugerCardId,
                                PhoneNumber: _this.myPhoneNum
                           },10);
                            this.typeInRegisterDruger = {};
                           this.occupationValue = "";
                            this.cultureValue = "";
                            this.nationValue = "";
                            this.checkedSex = 4;
                            this.livePlace1 = [];
                      }else{
                           console.log('没有路由');
                           _this.showRegisterState = true;
                           _this.showBack = false;
                          //没有路由跳转的
                           _this.showRegisterDruger({
                            ToKen: _this.token,
                            PhoneNumber: _this.myPhoneNum
                        },10);
                         this.typeInRegisterDruger = {};
                         this.occupationValue = "";
                         this.cultureValue = "";
                        this.nationValue = "";
                        this.checkedSex = 4;
                        this.livePlace1 = [];
                      }
                    }
                };
                this.Tool.submit(params_myUpload, params_postForm);
            },
            //确定提交完善人员信息
            submitPerfectInfo:function(){
                if(this.typeInRegisterDruger.HeadImageUrl == [] || !this.typeInRegisterDruger.DrugUserName || !this.typeInRegisterDruger.DrugUserCardId || 
                !this.typeInRegisterDruger.DrugPhoneNumber || !this.typeInRegisterDruger.PermanentAddress || !this.typeInRegisterDruger.detailPlace || this.typeInRegisterDruger.RrotocolPhoto ==[] ){
                     this.$notify({
                                title: '保存失败',
                                message: '请检查是否填写完整后再提交',
                                type: 'warning',
                                duration: 3000
                        });
                }
                var _this = this;
                this.ResidentialAddress =`${this.livePlace[0].name}-${this.livePlace[1].name}-${this.livePlace[2].name}-${this.livePlace[3].name}-${this.typeInRegisterDruger.detailPlace}`;
                console.log(this.ResidentialAddress);
                var picList = {
                    HeadImageUrl:this.typeInRegisterDruger["HeadImageUrl"],
                    RrotocolPhoto: this.typeInRegisterDruger["RrotocolPhoto"]
                };
                var uploadData = {
                    PhoneNumber:this.myPhoneNum,
                    ToKen:this.token,
                    DrugUserCardId:this.typeInRegisterDruger.DrugUserCardId,
                    DrugUserName:this.typeInRegisterDruger.DrugUserName,
                    OldName:this.typeInRegisterDruger.OldName,
                    Sex:this.checkedSex,
                    Ethnicity:this.nationValue,
                    PermanentAddress:this.typeInRegisterDruger.PermanentAddress,
                    ResidentialAddress:this.ResidentialAddress,
                    Culture: this.cultureValue,
                    Occupation:this.occupationValue,
                    DrugPhoneNumber:this.typeInRegisterDruger.DrugPhoneNumber,
                    ReportDate:this.formatTime(this.typeInRegisterDruger.ReportDate),
                    RehabilitativeStartDate:this.formatTime(this.typeInRegisterDruger.RehabilitativeStartDate),
                    RehabilitativeEndDate:this.formatTime(this.typeInRegisterDruger.RehabilitativeEndDate)
                };
                var params_myUpload = {
                    fileType: "pic",
                    fileList: picList
                };
                var params_postForm = {
                    url: "/home/query/perfectinformation",
                    data: uploadData,
                    success: function(res) {
                        console.log(res);
                        console.log('成功');
                        if(res.data.errno == 0){
                            _this.$notify({
                                title: '完善人员信息成功',
                                message: res.data.data,
                                type: 'success',
                                duration: 3000
                           });
                            //刷新
                         _this.registerDrugerState = 0;
                         _this.perfectInfoVisible = false;
                           if(_this.chooseState){
                                //有路由跳转的
                                _this.showRegisterState = false;
                                _this.showBack = true;
                                _this.showRegisterDruger({
                                        ToKen: _this.token,
                                        DrugerCardId:_this.getDrugerCardId,
                                        PhoneNumber: _this.myPhoneNum
                                },10);
                                _this.Tool.state = 3;
                                this.typeInRegisterDruger = {};
                                this.occupationValue = "";
                                    this.cultureValue = "";
                                    this.nationValue = "";
                                    this.checkedSex = 4;
                                    this.livePlace = [];
                            }else{
                                _this.Tool.state = 2;
                                _this.showRegisterState = true;
                                _this.showBack = false;
                                //没有路由跳转的
                                _this.showRegisterDruger({
                                    ToKen: _this.token,
                                    PhoneNumber: _this.myPhoneNum
                                },10);
                                this.typeInRegisterDruger = {};
                                this.occupationValue = "";
                                this.cultureValue = "";
                                this.nationValue = "";
                                this.checkedSex = 4;
                                this.livePlace = [];
                            }
                        }else{
                            _this.$notify({
                                title: '完善人员信息失败',
                                message: res.data.errmsg,
                                type: 'warning',
                                duration: 3000
                           });
                        }
                        // _this.resetForm(typeInRegisterDruger);
                        /* _this.showRegisterDruger({
                        ToKen: _this.token,
                        PhoneNumber: _this.myPhoneNum
                      },10); */
                    }
                };
                this.Tool.submit(params_myUpload, params_postForm); 
            },
            //人员核实确定提交
            submitForm() {
                shelterClaim: {
                    /* DeterminingUnit: '',
                    DeterminingTime: '',
                    LawBookNumber: '',
                    fileList: [], */
                };
                if(!this.shelterClaim.DeterminingUnit || !this.shelterClaim.DeterminingTime || !this.shelterClaim.LawBookNumber || this.shelterClaim.fileList == []){
                    this.$notify({
                                title: '提交失败',
                                message: '请检查是否填写完整后再提交',
                                type: 'warning',
                                duration: 3000
                        });
                }
                console.log('待登记提交');
                console.log(this.drugerName);
                console.log(this.formatTime(this.shelterClaim.DeterminingTime));
                var _this = this;
                var fileList = {
                    DecisionPhoto: this.shelterClaim["fileList"]
                };
                var formData = {
                    PhoneNumber: this.myPhoneNum,
                    DrugerName: this.drugerName,
                    DrugerCardId: this.drugerCardId,
                    ToKen: this.token,
                    DeterminingUnit: this.shelterClaim.DeterminingUnit,
                    DeterminingTime: this.formatTime(this.shelterClaim.DeterminingTime),
                    Drugategory: this.drugerType,
                    LawBookNumber: this.shelterClaim.LawBookNumber
                };
                var params_myUpload = {
                    fileType: "pic",
                    fileList: fileList
                };
                var params_postForm = {
                    url: "/home/query/setdruguser",
                    data: formData,
                    success: function(res) {
                        console.log(res);
                     if(res.data.errno == 0){
                        _this.shelterClaimVisible = false;
                        _this.$notify({
                                title: '认领成功',
                                message: res.data.data,
                                type: 'success',
                                duration: 3000
                        });
                        // _this.resetForm(resetForm);
                        //刷新页面
                       /*  _this.showShelter({
                            ToKen: _this.token,
                            PhoneNumber: _this.myPhoneNum
                        }); */
                        if(_this.chooseState){
                          //有路由跳转的
                           console.log('有路由跳转的刷新');
                           _this.Tool.state = 2;
                           _this.showBack = true;
                           _this.showShelter({
                            ToKen: _this.token,
                            DrugerCardId:_this.getDrugerCardId,
                            PhoneNumber: _this.myPhoneNum
                         });
                         this.shelterClaim = {};
                      }else{
                           _this.Tool.state = 1;
                           console.log('没有路由跳转的刷新');
                           _this.showBack = false;
                           _this.showShelter({
                            ToKen: _this.token,
                            PhoneNumber: _this.myPhoneNum
                        });
                        this.shelterClaim = {};
                      } 
                        }else{
                             _this.$notify({
                                title: '认领失败',
                                message: res.data.errmsg,
                                type: 'warning',
                                duration: 3000
                        });
                        }
                    }
                };
                this.Tool.submit(params_myUpload, params_postForm);
            },
            //人员核实确定选择文件
            getFile(file, fileList) {
                this.shelterClaim["fileList"] = fileList;
            },
            //选择近期头像
            getHeadImageUrl(file,fileList){
                this.typeInRegisterDruger["HeadImageUrl"] = fileList;
            },
            //选择决定书照片
            getDecisionPhoto(file,fileList){
                this.typeInRegisterDruger["DecisionPhoto"] = fileList;
            },
            //选择协议照片
            getRrotocolPhoto(file,fileList){
                console.log(fileList);
                this.typeInRegisterDruger["RrotocolPhoto"] = fileList;
            },
            //表单重置
          /*   resetForm: function(formName) {
            this.$refs[formName].resetFields();
            } */
        }
    }
</script>
<style scoped>
    h2 {
        color: #fff;
    }
    .backBtn{
        margin-bottom: 20px;
    }
    .imgs img{
        width: 100px;
        height: 100px;
        margin:5px;
        display: inline-block;
    }
    .drugerStatus{
        margin-bottom: 20px;
    }
    .handleRegister {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
    }
    .chooseRole {
        margin-top: 30px;
    }
    .info {
        line-height: 32px;
        color: #fff;
    }
    .info b {
        font-size: 16px;
        font-weight: normal;
        color: #fd0101;
    }
    .shelters {
        color: #fff;
        margin-top: 20px;
        background: #2c5aa0;
        padding: 20px;
    }
    .shelters li {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        margin-bottom: 30px;
    }
    .shelterList {
        width: 100px;
        display: inline-block;
    }
    .claimWrapper {
        padding-right: 30px;
        overflow-x: hidden;
        height: 400px;
        overflow-y: auto;
    }
</style>


