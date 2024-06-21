<style>
.ui-tabs .ui-tabs-nav li a {
    padding: 3px 10px;
}
.ui-tabs .ui-tabs-panel {
    padding: 0px 0px;
}
.dvInfoMsg {
    margin-top: 10px;
}
.ui-tabs .ui-tabs-panel {
    height: fit-content;
}
.sasGrid {
    border : 1px solid gray;
}
#Gridtabs.ui-widget-content {
    border : 0px solid blue;
}
#Gridtabs > .ui-tabs-nav.ui-widget-header {
    background : white;
    border-bottom: 1px solid #0c4173;
}
#Gridtabs > .ui-state-active, .ui-widget-content .ui-state-active, .ui-widget-header .ui-state-active a:link{
    color: #ffffff;
    font-weight: normal;
}
</style>
<div id=dvRslt>
    <div id="dvTitle" style="display:none;">
        <div id="dvInfoMessage" style="display:none;">
            <span id="info_msg" class="confItem" style="position: relative;float:left;padding-left:10px;margin-left: 3px;"></span>
        </div>
    </div>
    <div id="Gridtabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content"></div>
    <div id="dvFooter" style="display:none;">
        <div id="dvFooterButtons" align="right">
            <input type="button" id="btnUpload" class="btn_basic" value="엑셀 업로드" />
            <input type="button" id="btnDelete" class="btn_basic" value="삭제" />
            <input type="button" id="btnSave" class="btn_basic" value="저장" />
        </div>
    </div>
</div>
<div id="dvRes"></div>