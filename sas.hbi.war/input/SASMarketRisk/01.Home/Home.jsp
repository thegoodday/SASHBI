
			<style>
				@media (min-width: 1200px) {
					.container>.bg img, .container>a>.bg img {
						min-width: 60%;
					}
				}
				.container>.bg img, .container>a>.bg img {
				    position: absolute;
				    top: 0;
				    left: 0;
				    right: 0;
				    margin: auto;
				    z-index: -1;
				    min-width: 80%;
				    max-height: inherit;
				    min-height: 100%;
				}
				.container>.bg.bg-op-full, .container>a>.bg.bg-op-full {
				    opacity: 1;
				}
				.dark.container>.bg, .dark.container>a>.bg {
				    background-color: #666;
				    background-color: rgba(0,0,0,0.6);
				}
				.container>.bg, .container>a>.bg {
				    left: -50%;
				}

				.container>.bg, .container>a>.bg {
				    position: absolute;
				    top: 0;
				    z-index: -1;
				    overflow: hidden;
				    left: -70%;
				    width: 200%;
				    height: 100%;
				    -webkit-transition-property: left;
				    -webkit-transition-duration: .5s;
				    -webkit-transition-delay: 0;
				    -webkit-transition-timing-function: ease-out;
				    -moz-transition-property: left;
				    -moz-transition-delay: 0;
				    -moz-transition-duration: .5s;
				    -moz-transition-timing-function: ease-out;
				    -ms-transition-property: left;
				    -ms-transition-delay: 0;
				    -ms-transition-duration: .5s;
				    -ms-transition-timing-function: ease-out;
				    transition-property: left;
				    transition-delay: 0;
				    transition-duration: .5s;
				    transition-timing-function: ease-out;
				}
				.container {
				    width: 100%;
				    clear: both;
				    margin: 0;
				    position: relative;
				    text-align: center;
				}
				.overlay-blk .bg:before {
				    content: '';
				    position: absolute;
				    left: 0;
				    right: 0;
				    height: 100%;
				    width: 100%;
				    margin: 0;
				    padding: 0;
				    z-index: 1;
				    background: rgba(0,0,0,0.4);
				}	
				/* 글림 수정 : position 추가, 이미지명 | background-size | height 변경, opacity 삭제 */
				.container{
					position: relative;
					background:url('./images/main_kb_mr_new.jpg') no-repeat 0 0;
					background-size : cover;
					height: 100%;
					text-shadow: 0 -1px 0 rgba(0,0,0,0.35);
					/*opacity: .7;*/
				}
				/* 글림 수정 : .container h2 추가 */
				.container h2 {position: absolute; margin: 0; text-align: left; left: 195px; top: 313px;}
				/* 글림 수정 : .txt-large 스타일 전체 수정 */
				.txt-large {
					font-size: 50px;
					font-family: 'Lato',Arial,Helvetica,sans-serif;
					font-weight: 300;
					color: #ffffff;
					line-height: 70px;
				}
			</style>
			<div class="container">
				<!--
				<div class="bg bg-op-full bg-pos-full" style=" ">
					<img src="./images/sas_mr.jpg" alt="Man viewing SAS Market Risk Management for Insurance on desktop monitor" title="Man viewing SAS Market Risk Management for Insurance on desktop monitor" class="cq-dd-image">
				</div>
				-->
				<!-- 글림 수정 : div.link_box_wrap 추가 -->
				<div class="link_box_wrap clear_fix">
					<div class="link_box risk_viewer">
						<button type="button" class="btn_more"></button>
						<a href="/SASVisualAnalyticsViewer/VisualAnalyticsViewer.jsp">
							<span class="box_icon"></span>
							<span class="box_title">SAS<sup>®</sup> Market Risk Viewer</span>
						</a>
					</div>
					<div class="link_box report_design">
						<button type="button" class="btn_more"></button>
						<a href="/SASVisualAnalyticsDesigner/VisualAnalyticsDesigner.jsp">
							<span class="box_icon"></span>
							<span class="box_title">SAS<sup>®</sup> Market Risk Report Designer</span>
						</a>
					</div>
					<div class="link_box admin">
						<button type="button" class="btn_more"></button>
						<a href="/SASVisualAnalyticsAdministrator">
							<span class="box_icon"></span>
							<span class="box_title">SAS<sup>®</sup> Administeration</span>
						</a>
					</div>
				</div>
				<div class="par parsys">
					<div class="parbase section text">
						<div class="">
							<!-- 글림 수정 : p 태그 삭제, h2 style 삭제, txt-large 내 span 태크 추가 및 br 삭제 -->
							<h2>
								<span class="txt-large">
									<span class="bold">Accurate</span> asset valuation. <br>
									<span class="bold">Optimal</span> portfolio allocation. <br>
									<span class="bold">Better</span> risk analysis.
								</span>
							</h2>
						</div>
					</div>
				</div>	
			</div>