import React from 'react'

const PieChart = () => {
    return (
        <div class="row">
            <div class="col-lg-7 col-xl-8 grid-margin stretch-card">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-baseline mb-2">
                            <h6 class="card-title mb-0">Monthly sales</h6>
                            <div class="dropdown mb-2">
                                <a type="button" id="dropdownMenuButton4" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal icon-lg text-muted pb-3px">
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="19" cy="12" r="1"></circle>
                                        <circle cx="5" cy="12" r="1"></circle>
                                    </svg>
                                </a>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton4">
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye icon-sm me-2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        <span class="">View</span>
                                    </a>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 icon-sm me-2">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                        </svg>
                                        <span class="">Edit</span>
                                    </a>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash icon-sm me-2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        <span class="">Delete</span>
                                    </a>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-printer icon-sm me-2">
                                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                            <rect x="6" y="14" width="12" height="8"></rect>
                                        </svg>
                                        <span class="">Print</span>
                                    </a>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download icon-sm me-2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        <span class="">Download</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <p class="text-muted">Sales are activities related to selling or the number of goods or services sold in a given time period.</p>
                        <div id="monthlySalesChart" style={{ minHeight: '318px' }}>
                            {/* <div id="apexchartscksf0hov" class="apexcharts-canvas apexchartscksf0hov apexcharts-theme-light" style="width: 874px; height: 318px;">
                  <svg id="SvgjsSvg3455" width="874" height="318" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg apexcharts-zoomable" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: rgb(255, 255, 255);">
                     <g id="SvgjsG3457" class="apexcharts-inner apexcharts-graphical" transform="translate(84.56260603868557, 30)">
                        <defs id="SvgjsDefs3456">
                           <linearGradient id="SvgjsLinearGradient3463" x1="0" y1="0" x2="0" y2="1">
                              <stop id="SvgjsStop3464" stop-opacity="0.4" stop-color="rgba(216,227,240,0.4)" offset="0"></stop>
                              <stop id="SvgjsStop3465" stop-opacity="0.5" stop-color="rgba(190,209,230,0.5)" offset="1"></stop>
                              <stop id="SvgjsStop3466" stop-opacity="0.5" stop-color="rgba(190,209,230,0.5)" offset="1"></stop>
                           </linearGradient>
                           <clipPath id="gridRectMaskcksf0hov">
                              <rect id="SvgjsRect3482" width="815.1029453277588" height="261.0000003814697" x="-29.665551366444358" y="0" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect>
                           </clipPath>
                           <clipPath id="forecastMaskcksf0hov"></clipPath>
                           <clipPath id="nonForecastMaskcksf0hov"></clipPath>
                           <clipPath id="gridRectMarkerMaskcksf0hov">
                              <rect id="SvgjsRect3483" width="759.7718425948701" height="265.0000003814697" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect>
                           </clipPath>
                        </defs>
                        <rect id="SvgjsRect3467" width="31.679059270443656" height="261.0000003814697" x="0" y="0" rx="0" ry="0" opacity="1" stroke-width="0" stroke-dasharray="3" fill="url(#SvgjsLinearGradient3463)" class="apexcharts-xcrosshairs" y2="261.0000003814697" filter="none" fill-opacity="0.9"></rect>
                        <line id="SvgjsLine3565" x1="2.262789947888833" y1="262.0000003814697" x2="2.262789947888833" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3567" x1="72.40927833244265" y1="262.0000003814697" x2="72.40927833244265" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3569" x1="135.76739687332997" y1="262.0000003814697" x2="135.76739687332997" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3571" x1="205.9138852578838" y1="262.0000003814697" x2="205.9138852578838" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3573" x1="273.7975836945488" y1="262.0000003814697" x2="273.7975836945488" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3575" x1="343.9440720791026" y1="262.0000003814697" x2="343.9440720791026" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3577" x1="411.8277705157676" y1="262.0000003814697" x2="411.8277705157676" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3579" x1="481.97425890032144" y1="262.0000003814697" x2="481.97425890032144" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3581" x1="552.1207472848753" y1="262.0000003814697" x2="552.1207472848753" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3583" x1="620.0044457215403" y1="262.0000003814697" x2="620.0044457215403" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <line id="SvgjsLine3585" x1="690.150934106094" y1="262.0000003814697" x2="690.150934106094" y2="268.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-xaxis-tick"></line>
                        <g id="SvgjsG3594" class="apexcharts-xaxis" transform="translate(0, 0)">
                           <g id="SvgjsG3595" class="apexcharts-xaxis-texts-g" transform="translate(0, -4)">
                              <text id="SvgjsText3597" font-family="Helvetica, Arial, sans-serif" x="2.262789947888833" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="600" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3598">2022</tspan>
                                 <title>2022</title>
                              </text>
                              <text id="SvgjsText3600" font-family="Helvetica, Arial, sans-serif" x="72.40927833244265" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3601">Feb '22</tspan>
                                 <title>Feb '22</title>
                              </text>
                              <text id="SvgjsText3603" font-family="Helvetica, Arial, sans-serif" x="135.76739687332997" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3604">Mar '22</tspan>
                                 <title>Mar '22</title>
                              </text>
                              <text id="SvgjsText3606" font-family="Helvetica, Arial, sans-serif" x="205.9138852578838" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3607">Apr '22</tspan>
                                 <title>Apr '22</title>
                              </text>
                              <text id="SvgjsText3609" font-family="Helvetica, Arial, sans-serif" x="273.7975836945488" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3610">May '22</tspan>
                                 <title>May '22</title>
                              </text>
                              <text id="SvgjsText3612" font-family="Helvetica, Arial, sans-serif" x="343.9440720791026" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3613">Jun '22</tspan>
                                 <title>Jun '22</title>
                              </text>
                              <text id="SvgjsText3615" font-family="Helvetica, Arial, sans-serif" x="411.8277705157676" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3616">Jul '22</tspan>
                                 <title>Jul '22</title>
                              </text>
                              <text id="SvgjsText3618" font-family="Helvetica, Arial, sans-serif" x="481.97425890032144" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3619">Aug '22</tspan>
                                 <title>Aug '22</title>
                              </text>
                              <text id="SvgjsText3621" font-family="Helvetica, Arial, sans-serif" x="552.1207472848753" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3622">Sep '22</tspan>
                                 <title>Sep '22</title>
                              </text>
                              <text id="SvgjsText3624" font-family="Helvetica, Arial, sans-serif" x="620.0044457215403" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3625">Oct '22</tspan>
                                 <title>Oct '22</title>
                              </text>
                              <text id="SvgjsText3627" font-family="Helvetica, Arial, sans-serif" x="690.150934106094" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3628">Nov '22</tspan>
                                 <title>Nov '22</title>
                              </text>
                              <text id="SvgjsText3630" font-family="Helvetica, Arial, sans-serif" x="758.034632542759" y="290.0000003814697" text-anchor="middle" dominant-baseline="auto" font-size="12px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-xaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                                 <tspan id="SvgjsTspan3631">Dec '22</tspan>
                                 <title>Dec '22</title>
                              </text>
                           </g>
                        </g>
                        <g id="SvgjsG3560" class="apexcharts-grid">
                           <g id="SvgjsG3561" class="apexcharts-gridlines-horizontal">
                              <line id="SvgjsLine3588" x1="-27.665551366444358" y1="65.25000009536743" x2="783.4373939613145" y2="65.25000009536743" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3589" x1="-27.665551366444358" y1="130.50000019073485" x2="783.4373939613145" y2="130.50000019073485" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3590" x1="-27.665551366444358" y1="195.75000028610228" x2="783.4373939613145" y2="195.75000028610228" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                           </g>
                           <g id="SvgjsG3562" class="apexcharts-gridlines-vertical">
                              <line id="SvgjsLine3564" x1="2.262789947888833" y1="0" x2="2.262789947888833" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3566" x1="72.40927833244265" y1="0" x2="72.40927833244265" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3568" x1="135.76739687332997" y1="0" x2="135.76739687332997" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3570" x1="205.9138852578838" y1="0" x2="205.9138852578838" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3572" x1="273.7975836945488" y1="0" x2="273.7975836945488" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3574" x1="343.9440720791026" y1="0" x2="343.9440720791026" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3576" x1="411.8277705157676" y1="0" x2="411.8277705157676" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3578" x1="481.97425890032144" y1="0" x2="481.97425890032144" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3580" x1="552.1207472848753" y1="0" x2="552.1207472848753" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3582" x1="620.0044457215403" y1="0" x2="620.0044457215403" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3584" x1="690.150934106094" y1="0" x2="690.150934106094" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                              <line id="SvgjsLine3586" x1="758.034632542759" y1="0" x2="758.034632542759" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                           </g>
                           <line id="SvgjsLine3593" x1="0" y1="261.0000003814697" x2="755.7718425948701" y2="261.0000003814697" stroke="transparent" stroke-dasharray="0" stroke-linecap="butt"></line>
                           <line id="SvgjsLine3592" x1="0" y1="1" x2="0" y2="261.0000003814697" stroke="transparent" stroke-dasharray="0" stroke-linecap="butt"></line>
                        </g>
                        <g id="SvgjsG3484" class="apexcharts-bar-series apexcharts-plot-series">
                           <g id="SvgjsG3485" class="apexcharts-series" rel="1" seriesName="Sales" data:realIndex="0">
                              <path id="SvgjsPath3489" d="M -15.839529635221828 257.0010003814697 L -15.839529635221828 66.64100009155271 C -15.839529635221828 64.64100009155271 -13.839529635221828 62.641000091552705 -11.839529635221828 62.641000091552705 L 11.839529635221828 62.641000091552705 C 13.839529635221828 62.641000091552705 15.839529635221828 64.64100009155271 15.839529635221828 66.64100009155271 L 15.839529635221828 257.0010003814697 C 15.839529635221828 259.0010003814697 13.839529635221828 261.0010003814697 11.839529635221828 261.0010003814697 L -11.839529635221828 261.0010003814697 C -13.839529635221828 261.0010003814697 -15.839529635221828 259.0010003814697 -15.839529635221828 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M -15.839529635221828 257.0010003814697 L -15.839529635221828 66.64100009155271 C -15.839529635221828 64.64100009155271 -13.839529635221828 62.641000091552705 -11.839529635221828 62.641000091552705 L 11.839529635221828 62.641000091552705 C 13.839529635221828 62.641000091552705 15.839529635221828 64.64100009155271 15.839529635221828 66.64100009155271 L 15.839529635221828 257.0010003814697 C 15.839529635221828 259.0010003814697 13.839529635221828 261.0010003814697 11.839529635221828 261.0010003814697 L -11.839529635221828 261.0010003814697 C -13.839529635221828 261.0010003814697 -15.839529635221828 259.0010003814697 -15.839529635221828 257.0010003814697 Z " pathFrom="M -15.839529635221828 261.0010003814697 L -15.839529635221828 261.0010003814697 L 15.839529635221828 261.0010003814697 L 15.839529635221828 261.0010003814697 L 15.839529635221828 261.0010003814697 L 15.839529635221828 261.0010003814697 L 15.839529635221828 261.0010003814697 L -15.839529635221828 261.0010003814697 Z" cy="62.64000009155271" cx="15.839529635221828" j="0" val="152" barHeight="198.360000289917" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3495" d="M 54.306958749331976 257.0010003814697 L 54.306958749331976 122.75600017356871 C 54.306958749331976 120.75600017356871 56.306958749331976 118.75600017356871 58.306958749331976 118.75600017356871 L 81.98601801977563 118.75600017356871 C 83.98601801977563 118.75600017356871 85.98601801977563 120.75600017356871 85.98601801977563 122.75600017356871 L 85.98601801977563 257.0010003814697 C 85.98601801977563 259.0010003814697 83.98601801977563 261.0010003814697 81.98601801977563 261.0010003814697 L 58.306958749331976 261.0010003814697 C 56.306958749331976 261.0010003814697 54.306958749331976 259.0010003814697 54.306958749331976 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 54.306958749331976 257.0010003814697 L 54.306958749331976 122.75600017356871 C 54.306958749331976 120.75600017356871 56.306958749331976 118.75600017356871 58.306958749331976 118.75600017356871 L 81.98601801977563 118.75600017356871 C 83.98601801977563 118.75600017356871 85.98601801977563 120.75600017356871 85.98601801977563 122.75600017356871 L 85.98601801977563 257.0010003814697 C 85.98601801977563 259.0010003814697 83.98601801977563 261.0010003814697 81.98601801977563 261.0010003814697 L 58.306958749331976 261.0010003814697 C 56.306958749331976 261.0010003814697 54.306958749331976 259.0010003814697 54.306958749331976 257.0010003814697 Z " pathFrom="M 54.306958749331976 261.0010003814697 L 54.306958749331976 261.0010003814697 L 85.98601801977563 261.0010003814697 L 85.98601801977563 261.0010003814697 L 85.98601801977563 261.0010003814697 L 85.98601801977563 261.0010003814697 L 85.98601801977563 261.0010003814697 L 54.306958749331976 261.0010003814697 Z" cy="118.7550001735687" cx="85.98601801977563" j="1" val="109" barHeight="142.245000207901" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3501" d="M 117.6650772902193 257.0010003814697 L 117.6650772902193 143.6360002040863 C 117.6650772902193 141.6360002040863 119.6650772902193 139.6360002040863 121.6650772902193 139.6360002040863 L 145.34413656066295 139.6360002040863 C 147.34413656066295 139.6360002040863 149.34413656066295 141.6360002040863 149.34413656066295 143.6360002040863 L 149.34413656066295 257.0010003814697 C 149.34413656066295 259.0010003814697 147.34413656066295 261.0010003814697 145.34413656066295 261.0010003814697 L 121.6650772902193 261.0010003814697 C 119.6650772902193 261.0010003814697 117.6650772902193 259.0010003814697 117.6650772902193 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 117.6650772902193 257.0010003814697 L 117.6650772902193 143.6360002040863 C 117.6650772902193 141.6360002040863 119.6650772902193 139.6360002040863 121.6650772902193 139.6360002040863 L 145.34413656066295 139.6360002040863 C 147.34413656066295 139.6360002040863 149.34413656066295 141.6360002040863 149.34413656066295 143.6360002040863 L 149.34413656066295 257.0010003814697 C 149.34413656066295 259.0010003814697 147.34413656066295 261.0010003814697 145.34413656066295 261.0010003814697 L 121.6650772902193 261.0010003814697 C 119.6650772902193 261.0010003814697 117.6650772902193 259.0010003814697 117.6650772902193 257.0010003814697 Z " pathFrom="M 117.6650772902193 261.0010003814697 L 117.6650772902193 261.0010003814697 L 149.34413656066295 261.0010003814697 L 149.34413656066295 261.0010003814697 L 149.34413656066295 261.0010003814697 L 149.34413656066295 261.0010003814697 L 149.34413656066295 261.0010003814697 L 117.6650772902193 261.0010003814697 Z" cy="139.63500020408628" cx="149.34413656066295" j="2" val="93" barHeight="121.36500017738342" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3507" d="M 187.8115656747731 257.0010003814697 L 187.8115656747731 117.53600016593933 C 187.8115656747731 115.53600016593933 189.8115656747731 113.53600016593933 191.8115656747731 113.53600016593933 L 215.49062494521675 113.53600016593933 C 217.49062494521675 113.53600016593933 219.49062494521675 115.53600016593933 219.49062494521675 117.53600016593933 L 219.49062494521675 257.0010003814697 C 219.49062494521675 259.0010003814697 217.49062494521675 261.0010003814697 215.49062494521675 261.0010003814697 L 191.8115656747731 261.0010003814697 C 189.8115656747731 261.0010003814697 187.8115656747731 259.0010003814697 187.8115656747731 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 187.8115656747731 257.0010003814697 L 187.8115656747731 117.53600016593933 C 187.8115656747731 115.53600016593933 189.8115656747731 113.53600016593933 191.8115656747731 113.53600016593933 L 215.49062494521675 113.53600016593933 C 217.49062494521675 113.53600016593933 219.49062494521675 115.53600016593933 219.49062494521675 117.53600016593933 L 219.49062494521675 257.0010003814697 C 219.49062494521675 259.0010003814697 217.49062494521675 261.0010003814697 215.49062494521675 261.0010003814697 L 191.8115656747731 261.0010003814697 C 189.8115656747731 261.0010003814697 187.8115656747731 259.0010003814697 187.8115656747731 257.0010003814697 Z " pathFrom="M 187.8115656747731 261.0010003814697 L 187.8115656747731 261.0010003814697 L 219.49062494521675 261.0010003814697 L 219.49062494521675 261.0010003814697 L 219.49062494521675 261.0010003814697 L 219.49062494521675 261.0010003814697 L 219.49062494521675 261.0010003814697 L 187.8115656747731 261.0010003814697 Z" cy="113.53500016593932" cx="219.49062494521675" j="3" val="113" barHeight="147.46500021553038" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3513" d="M 255.69526411143806 257.0010003814697 L 255.69526411143806 100.5710001411438 C 255.69526411143806 98.5710001411438 257.69526411143806 96.5710001411438 259.69526411143806 96.5710001411438 L 283.3743233818817 96.5710001411438 C 285.3743233818817 96.5710001411438 287.3743233818817 98.5710001411438 287.3743233818817 100.5710001411438 L 287.3743233818817 257.0010003814697 C 287.3743233818817 259.0010003814697 285.3743233818817 261.0010003814697 283.3743233818817 261.0010003814697 L 259.69526411143806 261.0010003814697 C 257.69526411143806 261.0010003814697 255.69526411143806 259.0010003814697 255.69526411143806 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 255.69526411143806 257.0010003814697 L 255.69526411143806 100.5710001411438 C 255.69526411143806 98.5710001411438 257.69526411143806 96.5710001411438 259.69526411143806 96.5710001411438 L 283.3743233818817 96.5710001411438 C 285.3743233818817 96.5710001411438 287.3743233818817 98.5710001411438 287.3743233818817 100.5710001411438 L 287.3743233818817 257.0010003814697 C 287.3743233818817 259.0010003814697 285.3743233818817 261.0010003814697 283.3743233818817 261.0010003814697 L 259.69526411143806 261.0010003814697 C 257.69526411143806 261.0010003814697 255.69526411143806 259.0010003814697 255.69526411143806 257.0010003814697 Z " pathFrom="M 255.69526411143806 261.0010003814697 L 255.69526411143806 261.0010003814697 L 287.3743233818817 261.0010003814697 L 287.3743233818817 261.0010003814697 L 287.3743233818817 261.0010003814697 L 287.3743233818817 261.0010003814697 L 287.3743233818817 261.0010003814697 L 255.69526411143806 261.0010003814697 Z" cy="96.5700001411438" cx="287.3743233818817" j="4" val="126" barHeight="164.4300002403259" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3519" d="M 325.8417524959919 257.0010003814697 L 325.8417524959919 54.896000074386585 C 325.8417524959919 52.896000074386585 327.8417524959919 50.896000074386585 329.8417524959919 50.896000074386585 L 353.52081176643554 50.896000074386585 C 355.52081176643554 50.896000074386585 357.52081176643554 52.896000074386585 357.52081176643554 54.896000074386585 L 357.52081176643554 257.0010003814697 C 357.52081176643554 259.0010003814697 355.52081176643554 261.0010003814697 353.52081176643554 261.0010003814697 L 329.8417524959919 261.0010003814697 C 327.8417524959919 261.0010003814697 325.8417524959919 259.0010003814697 325.8417524959919 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 325.8417524959919 257.0010003814697 L 325.8417524959919 54.896000074386585 C 325.8417524959919 52.896000074386585 327.8417524959919 50.896000074386585 329.8417524959919 50.896000074386585 L 353.52081176643554 50.896000074386585 C 355.52081176643554 50.896000074386585 357.52081176643554 52.896000074386585 357.52081176643554 54.896000074386585 L 357.52081176643554 257.0010003814697 C 357.52081176643554 259.0010003814697 355.52081176643554 261.0010003814697 353.52081176643554 261.0010003814697 L 329.8417524959919 261.0010003814697 C 327.8417524959919 261.0010003814697 325.8417524959919 259.0010003814697 325.8417524959919 257.0010003814697 Z " pathFrom="M 325.8417524959919 261.0010003814697 L 325.8417524959919 261.0010003814697 L 357.52081176643554 261.0010003814697 L 357.52081176643554 261.0010003814697 L 357.52081176643554 261.0010003814697 L 357.52081176643554 261.0010003814697 L 357.52081176643554 261.0010003814697 L 325.8417524959919 261.0010003814697 Z" cy="50.89500007438659" cx="357.52081176643554" j="5" val="161" barHeight="210.10500030708312" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3525" d="M 393.7254509326569 257.0010003814697 L 393.7254509326569 19.661000022888167 C 393.7254509326569 17.661000022888167 395.7254509326569 15.66100002288817 397.7254509326569 15.66100002288817 L 421.40451020310053 15.66100002288817 C 423.40451020310053 15.66100002288817 425.40451020310053 17.661000022888167 425.40451020310053 19.661000022888167 L 425.40451020310053 257.0010003814697 C 425.40451020310053 259.0010003814697 423.40451020310053 261.0010003814697 421.40451020310053 261.0010003814697 L 397.7254509326569 261.0010003814697 C 395.7254509326569 261.0010003814697 393.7254509326569 259.0010003814697 393.7254509326569 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 393.7254509326569 257.0010003814697 L 393.7254509326569 19.661000022888167 C 393.7254509326569 17.661000022888167 395.7254509326569 15.66100002288817 397.7254509326569 15.66100002288817 L 421.40451020310053 15.66100002288817 C 423.40451020310053 15.66100002288817 425.40451020310053 17.661000022888167 425.40451020310053 19.661000022888167 L 425.40451020310053 257.0010003814697 C 425.40451020310053 259.0010003814697 423.40451020310053 261.0010003814697 421.40451020310053 261.0010003814697 L 397.7254509326569 261.0010003814697 C 395.7254509326569 261.0010003814697 393.7254509326569 259.0010003814697 393.7254509326569 257.0010003814697 Z " pathFrom="M 393.7254509326569 261.0010003814697 L 393.7254509326569 261.0010003814697 L 425.40451020310053 261.0010003814697 L 425.40451020310053 261.0010003814697 L 425.40451020310053 261.0010003814697 L 425.40451020310053 261.0010003814697 L 425.40451020310053 261.0010003814697 L 393.7254509326569 261.0010003814697 Z" cy="15.66000002288817" cx="425.40451020310053" j="6" val="188" barHeight="245.34000035858153" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3531" d="M 463.87193931721066 257.0010003814697 L 463.87193931721066 78.38600010871886 C 463.87193931721066 76.38600010871886 465.87193931721066 74.38600010871886 467.87193931721066 74.38600010871886 L 491.5509985876543 74.38600010871886 C 493.5509985876543 74.38600010871886 495.5509985876543 76.38600010871886 495.5509985876543 78.38600010871886 L 495.5509985876543 257.0010003814697 C 495.5509985876543 259.0010003814697 493.5509985876543 261.0010003814697 491.5509985876543 261.0010003814697 L 467.87193931721066 261.0010003814697 C 465.87193931721066 261.0010003814697 463.87193931721066 259.0010003814697 463.87193931721066 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 463.87193931721066 257.0010003814697 L 463.87193931721066 78.38600010871886 C 463.87193931721066 76.38600010871886 465.87193931721066 74.38600010871886 467.87193931721066 74.38600010871886 L 491.5509985876543 74.38600010871886 C 493.5509985876543 74.38600010871886 495.5509985876543 76.38600010871886 495.5509985876543 78.38600010871886 L 495.5509985876543 257.0010003814697 C 495.5509985876543 259.0010003814697 493.5509985876543 261.0010003814697 491.5509985876543 261.0010003814697 L 467.87193931721066 261.0010003814697 C 465.87193931721066 261.0010003814697 463.87193931721066 259.0010003814697 463.87193931721066 257.0010003814697 Z " pathFrom="M 463.87193931721066 261.0010003814697 L 463.87193931721066 261.0010003814697 L 495.5509985876543 261.0010003814697 L 495.5509985876543 261.0010003814697 L 495.5509985876543 261.0010003814697 L 495.5509985876543 261.0010003814697 L 495.5509985876543 261.0010003814697 L 463.87193931721066 261.0010003814697 Z" cy="74.38500010871886" cx="495.5509985876543" j="7" val="143" barHeight="186.61500027275085" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3537" d="M 534.0184277017644 257.0010003814697 L 534.0184277017644 131.89100018692014 C 534.0184277017644 129.89100018692014 536.0184277017644 127.89100018692014 538.0184277017644 127.89100018692014 L 561.697486972208 127.89100018692014 C 563.697486972208 127.89100018692014 565.697486972208 129.89100018692014 565.697486972208 131.89100018692014 L 565.697486972208 257.0010003814697 C 565.697486972208 259.0010003814697 563.697486972208 261.0010003814697 561.697486972208 261.0010003814697 L 538.0184277017644 261.0010003814697 C 536.0184277017644 261.0010003814697 534.0184277017644 259.0010003814697 534.0184277017644 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 534.0184277017644 257.0010003814697 L 534.0184277017644 131.89100018692014 C 534.0184277017644 129.89100018692014 536.0184277017644 127.89100018692014 538.0184277017644 127.89100018692014 L 561.697486972208 127.89100018692014 C 563.697486972208 127.89100018692014 565.697486972208 129.89100018692014 565.697486972208 131.89100018692014 L 565.697486972208 257.0010003814697 C 565.697486972208 259.0010003814697 563.697486972208 261.0010003814697 561.697486972208 261.0010003814697 L 538.0184277017644 261.0010003814697 C 536.0184277017644 261.0010003814697 534.0184277017644 259.0010003814697 534.0184277017644 257.0010003814697 Z " pathFrom="M 534.0184277017644 261.0010003814697 L 534.0184277017644 261.0010003814697 L 565.697486972208 261.0010003814697 L 565.697486972208 261.0010003814697 L 565.697486972208 261.0010003814697 L 565.697486972208 261.0010003814697 L 565.697486972208 261.0010003814697 L 534.0184277017644 261.0010003814697 Z" cy="127.89000018692013" cx="565.697486972208" j="8" val="102" barHeight="133.11000019454957" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3543" d="M 601.9021261384294 257.0010003814697 L 601.9021261384294 117.53600016593933 C 601.9021261384294 115.53600016593933 603.9021261384294 113.53600016593933 605.9021261384294 113.53600016593933 L 629.581185408873 113.53600016593933 C 631.581185408873 113.53600016593933 633.581185408873 115.53600016593933 633.581185408873 117.53600016593933 L 633.581185408873 257.0010003814697 C 633.581185408873 259.0010003814697 631.581185408873 261.0010003814697 629.581185408873 261.0010003814697 L 605.9021261384294 261.0010003814697 C 603.9021261384294 261.0010003814697 601.9021261384294 259.0010003814697 601.9021261384294 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 601.9021261384294 257.0010003814697 L 601.9021261384294 117.53600016593933 C 601.9021261384294 115.53600016593933 603.9021261384294 113.53600016593933 605.9021261384294 113.53600016593933 L 629.581185408873 113.53600016593933 C 631.581185408873 113.53600016593933 633.581185408873 115.53600016593933 633.581185408873 117.53600016593933 L 633.581185408873 257.0010003814697 C 633.581185408873 259.0010003814697 631.581185408873 261.0010003814697 629.581185408873 261.0010003814697 L 605.9021261384294 261.0010003814697 C 603.9021261384294 261.0010003814697 601.9021261384294 259.0010003814697 601.9021261384294 257.0010003814697 Z " pathFrom="M 601.9021261384294 261.0010003814697 L 601.9021261384294 261.0010003814697 L 633.581185408873 261.0010003814697 L 633.581185408873 261.0010003814697 L 633.581185408873 261.0010003814697 L 633.581185408873 261.0010003814697 L 633.581185408873 261.0010003814697 L 601.9021261384294 261.0010003814697 Z" cy="113.53500016593932" cx="633.581185408873" j="9" val="113" barHeight="147.46500021553038" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3549" d="M 672.0486145229831 257.0010003814697 L 672.0486145229831 113.62100016021728 C 672.0486145229831 111.62100016021728 674.0486145229831 109.62100016021728 676.0486145229831 109.62100016021728 L 699.7276737934268 109.62100016021728 C 701.7276737934268 109.62100016021728 703.7276737934268 111.62100016021728 703.7276737934268 113.62100016021728 L 703.7276737934268 257.0010003814697 C 703.7276737934268 259.0010003814697 701.7276737934268 261.0010003814697 699.7276737934268 261.0010003814697 L 676.0486145229831 261.0010003814697 C 674.0486145229831 261.0010003814697 672.0486145229831 259.0010003814697 672.0486145229831 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 672.0486145229831 257.0010003814697 L 672.0486145229831 113.62100016021728 C 672.0486145229831 111.62100016021728 674.0486145229831 109.62100016021728 676.0486145229831 109.62100016021728 L 699.7276737934268 109.62100016021728 C 701.7276737934268 109.62100016021728 703.7276737934268 111.62100016021728 703.7276737934268 113.62100016021728 L 703.7276737934268 257.0010003814697 C 703.7276737934268 259.0010003814697 701.7276737934268 261.0010003814697 699.7276737934268 261.0010003814697 L 676.0486145229831 261.0010003814697 C 674.0486145229831 261.0010003814697 672.0486145229831 259.0010003814697 672.0486145229831 257.0010003814697 Z " pathFrom="M 672.0486145229831 261.0010003814697 L 672.0486145229831 261.0010003814697 L 703.7276737934268 261.0010003814697 L 703.7276737934268 261.0010003814697 L 703.7276737934268 261.0010003814697 L 703.7276737934268 261.0010003814697 L 703.7276737934268 261.0010003814697 L 672.0486145229831 261.0010003814697 Z" cy="109.62000016021727" cx="703.7276737934268" j="10" val="116" barHeight="151.38000022125243" barWidth="31.679059270443656"></path>
                              <path id="SvgjsPath3555" d="M 739.9323129596481 257.0010003814697 L 739.9323129596481 103.18100014495849 C 739.9323129596481 101.18100014495849 741.9323129596481 99.18100014495849 743.9323129596481 99.18100014495849 L 767.6113722300918 99.18100014495849 C 769.6113722300918 99.18100014495849 771.6113722300918 101.18100014495849 771.6113722300918 103.18100014495849 L 771.6113722300918 257.0010003814697 C 771.6113722300918 259.0010003814697 769.6113722300918 261.0010003814697 767.6113722300918 261.0010003814697 L 743.9323129596481 261.0010003814697 C 741.9323129596481 261.0010003814697 739.9323129596481 259.0010003814697 739.9323129596481 257.0010003814697 Z " fill="rgba(101,113,255,0.9)" fill-opacity="1" stroke-opacity="1" stroke-linecap="round" stroke-width="0" stroke-dasharray="0" class="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskcksf0hov)" pathTo="M 739.9323129596481 257.0010003814697 L 739.9323129596481 103.18100014495849 C 739.9323129596481 101.18100014495849 741.9323129596481 99.18100014495849 743.9323129596481 99.18100014495849 L 767.6113722300918 99.18100014495849 C 769.6113722300918 99.18100014495849 771.6113722300918 101.18100014495849 771.6113722300918 103.18100014495849 L 771.6113722300918 257.0010003814697 C 771.6113722300918 259.0010003814697 769.6113722300918 261.0010003814697 767.6113722300918 261.0010003814697 L 743.9323129596481 261.0010003814697 C 741.9323129596481 261.0010003814697 739.9323129596481 259.0010003814697 739.9323129596481 257.0010003814697 Z " pathFrom="M 739.9323129596481 261.0010003814697 L 739.9323129596481 261.0010003814697 L 771.6113722300918 261.0010003814697 L 771.6113722300918 261.0010003814697 L 771.6113722300918 261.0010003814697 L 771.6113722300918 261.0010003814697 L 771.6113722300918 261.0010003814697 L 739.9323129596481 261.0010003814697 Z" cy="99.18000014495848" cx="771.6113722300918" j="11" val="124" barHeight="161.82000023651122" barWidth="31.679059270443656"></path>
                              <g id="SvgjsG3487" class="apexcharts-bar-goals-markers" style="pointer-events: none">
                                 <g id="SvgjsG3488" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3494" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3500" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3506" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3512" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3518" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3524" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3530" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3536" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3542" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3548" className="apexcharts-bar-goals-groups"></g>
                                 <g id="SvgjsG3554" className="apexcharts-bar-goals-groups"></g>
                              </g>
                           </g>
                           <g id="SvgjsG3486" class="apexcharts-datalabels" data:realIndex="0">
                              <g id="SvgjsG3491" class="apexcharts-data-labels" transform="rotate(-90, 3.3333334922790527, 89.64000009155271)">
                                 <text id="SvgjsText3493" font-family="'Roboto', Helvetica, sans-serif" x="3.3333334922790527" y="89.64000009155271" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="3.3333334922790527" cy="89.64000009155271" style="font-family: Roboto, Helvetica, sans-serif;">152</text>
                              </g>
                              <g id="SvgjsG3497" class="apexcharts-data-labels" transform="rotate(-90, 73.47982187683286, 145.7550001735687)">
                                 <text id="SvgjsText3499" font-family="'Roboto', Helvetica, sans-serif" x="73.47982187683286" y="145.7550001735687" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="73.47982187683286" cy="145.7550001735687" style="font-family: Roboto, Helvetica, sans-serif;">109</text>
                              </g>
                              <g id="SvgjsG3503" class="apexcharts-data-labels" transform="rotate(-90, 136.83794041772018, 166.63500020408628)">
                                 <text id="SvgjsText3505" font-family="'Roboto', Helvetica, sans-serif" x="136.83794041772018" y="166.63500020408628" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="136.83794041772018" cy="166.63500020408628" style="font-family: Roboto, Helvetica, sans-serif;">93</text>
                              </g>
                              <g id="SvgjsG3509" class="apexcharts-data-labels" transform="rotate(-90, 206.98442880227398, 140.53500016593932)">
                                 <text id="SvgjsText3511" font-family="'Roboto', Helvetica, sans-serif" x="206.98442880227398" y="140.53500016593932" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="206.98442880227398" cy="140.53500016593932" style="font-family: Roboto, Helvetica, sans-serif;">113</text>
                              </g>
                              <g id="SvgjsG3515" class="apexcharts-data-labels" transform="rotate(-90, 274.86812723893894, 123.5700001411438)">
                                 <text id="SvgjsText3517" font-family="'Roboto', Helvetica, sans-serif" x="274.86812723893894" y="123.5700001411438" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="274.86812723893894" cy="123.5700001411438" style="font-family: Roboto, Helvetica, sans-serif;">126</text>
                              </g>
                              <g id="SvgjsG3521" class="apexcharts-data-labels" transform="rotate(-90, 345.0146156234928, 77.89500007438659)">
                                 <text id="SvgjsText3523" font-family="'Roboto', Helvetica, sans-serif" x="345.0146156234928" y="77.89500007438659" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="345.0146156234928" cy="77.89500007438659" style="font-family: Roboto, Helvetica, sans-serif;">161</text>
                              </g>
                              <g id="SvgjsG3527" class="apexcharts-data-labels" transform="rotate(-90, 412.89831406015776, 42.66000002288817)">
                                 <text id="SvgjsText3529" font-family="'Roboto', Helvetica, sans-serif" x="412.89831406015776" y="42.66000002288817" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="412.89831406015776" cy="42.66000002288817" style="font-family: Roboto, Helvetica, sans-serif;">188</text>
                              </g>
                              <g id="SvgjsG3533" class="apexcharts-data-labels" transform="rotate(-90, 483.04480244471154, 101.38500010871886)">
                                 <text id="SvgjsText3535" font-family="'Roboto', Helvetica, sans-serif" x="483.04480244471154" y="101.38500010871886" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="483.04480244471154" cy="101.38500010871886" style="font-family: Roboto, Helvetica, sans-serif;">143</text>
                              </g>
                              <g id="SvgjsG3539" class="apexcharts-data-labels" transform="rotate(-90, 553.1912908292652, 154.89000018692013)">
                                 <text id="SvgjsText3541" font-family="'Roboto', Helvetica, sans-serif" x="553.1912908292652" y="154.89000018692013" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="553.1912908292652" cy="154.89000018692013" style="font-family: Roboto, Helvetica, sans-serif;">102</text>
                              </g>
                              <g id="SvgjsG3545" class="apexcharts-data-labels" transform="rotate(-90, 621.0749892659302, 140.53500016593932)">
                                 <text id="SvgjsText3547" font-family="'Roboto', Helvetica, sans-serif" x="621.0749892659302" y="140.53500016593932" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="621.0749892659302" cy="140.53500016593932" style="font-family: Roboto, Helvetica, sans-serif;">113</text>
                              </g>
                              <g id="SvgjsG3551" class="apexcharts-data-labels" transform="rotate(-90, 691.221477650484, 136.62000016021727)">
                                 <text id="SvgjsText3553" font-family="'Roboto', Helvetica, sans-serif" x="691.221477650484" y="136.62000016021727" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="691.221477650484" cy="136.62000016021727" style="font-family: Roboto, Helvetica, sans-serif;">116</text>
                              </g>
                              <g id="SvgjsG3557" class="apexcharts-data-labels" transform="rotate(-90, 759.105176087149, 126.18000014495848)">
                                 <text id="SvgjsText3559" font-family="'Roboto', Helvetica, sans-serif" x="759.105176087149" y="126.18000014495848" text-anchor="start" dominant-baseline="auto" font-size="10px" font-weight="600" fill="#ffffff" class="apexcharts-datalabel" cx="759.105176087149" cy="126.18000014495848" style="font-family: Roboto, Helvetica, sans-serif;">124</text>
                              </g>
                           </g>
                        </g>
                        <g id="SvgjsG3563" class="apexcharts-grid-borders">
                           <line id="SvgjsLine3587" x1="-27.665551366444358" y1="0" x2="783.4373939613145" y2="0" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                           <line id="SvgjsLine3591" x1="-27.665551366444358" y1="261.0000003814697" x2="783.4373939613145" y2="261.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line>
                           <line id="SvgjsLine3632" x1="-27.665551366444358" y1="262.0000003814697" x2="783.4373939613145" y2="262.0000003814697" stroke="rgba(77, 138, 240, .15)" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt"></line>
                        </g>
                        <line id="SvgjsLine3652" x1="-27.665551366444358" y1="0" x2="783.4373939613145" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line>
                        <line id="SvgjsLine3653" x1="-27.665551366444358" y1="0" x2="783.4373939613145" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line>
                        <g id="SvgjsG3654" class="apexcharts-yaxis-annotations"></g>
                        <g id="SvgjsG3655" class="apexcharts-xaxis-annotations"></g>
                        <g id="SvgjsG3656" class="apexcharts-point-annotations"></g>
                        <rect id="SvgjsRect3657" width="0" height="0" x="0" y="0" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fefefe" class="apexcharts-zoom-rect"></rect>
                        <rect id="SvgjsRect3658" width="0" height="0" x="0" y="0" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fefefe" class="apexcharts-selection-rect"></rect>
                     </g>
                     <g id="SvgjsG3633" class="apexcharts-yaxis" rel="0" transform="translate(22.89705467224121, 0)">
                        <g id="SvgjsG3634" class="apexcharts-yaxis-texts-g">
                           <text id="SvgjsText3636" font-family="Helvetica, Arial, sans-serif" x="20" y="31.4" text-anchor="end" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-yaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                              <tspan id="SvgjsTspan3637">200</tspan>
                              <title>200</title>
                           </text>
                           <text id="SvgjsText3639" font-family="Helvetica, Arial, sans-serif" x="20" y="96.65000009536743" text-anchor="end" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-yaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                              <tspan id="SvgjsTspan3640">150</tspan>
                              <title>150</title>
                           </text>
                           <text id="SvgjsText3642" font-family="Helvetica, Arial, sans-serif" x="20" y="161.90000019073486" text-anchor="end" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-yaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                              <tspan id="SvgjsTspan3643">100</tspan>
                              <title>100</title>
                           </text>
                           <text id="SvgjsText3645" font-family="Helvetica, Arial, sans-serif" x="20" y="227.15000028610228" text-anchor="end" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-yaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                              <tspan id="SvgjsTspan3646">50</tspan>
                              <title>50</title>
                           </text>
                           <text id="SvgjsText3648" font-family="Helvetica, Arial, sans-serif" x="20" y="292.4000003814697" text-anchor="end" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-yaxis-label " style="font-family: Helvetica, Arial, sans-serif;">
                              <tspan id="SvgjsTspan3649">0</tspan>
                              <title>0</title>
                           </text>
                        </g>
                        <g id="SvgjsG3650" class="apexcharts-yaxis-title">
                           <text id="SvgjsText3651" font-family="Helvetica, Arial, sans-serif" x="36.54945373535156" y="160.50000019073485" text-anchor="end" dominant-baseline="auto" font-size="11px" font-weight="900" fill="#7987a1" class="apexcharts-text apexcharts-yaxis-title-text " style="font-family: Helvetica, Arial, sans-serif;" transform="rotate(-90 -13.059593200683594 156.05555725097656)">Number of Sales</text>
                        </g>
                     </g>
                     <g id="SvgjsG3458" class="apexcharts-annotations"></g>
                  </svg>
                  <div class="apexcharts-legend" style="max-height: 159px;"></div>
                  <div class="apexcharts-tooltip apexcharts-theme-light">
                     <div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;"></div>
                     <div class="apexcharts-tooltip-series-group" style="order: 1;">
                        <span class="apexcharts-tooltip-marker" style="background-color: rgb(101, 113, 255);"></span>
                        <div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">
                           <div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div>
                           <div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div>
                           <div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div>
                        </div>
                     </div>
                  </div>
                  <div class="apexcharts-yaxistooltip apexcharts-yaxistooltip-0 apexcharts-yaxistooltip-left apexcharts-theme-light">
                     <div class="apexcharts-yaxistooltip-text"></div>
                  </div>
               </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-5 col-xl-4 grid-margin stretch-card">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-baseline">
                            <h6 class="card-title mb-0">Cloud storage</h6>
                            <div class="dropdown mb-2">
                                <a type="button" id="dropdownMenuButton5" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal icon-lg text-muted pb-3px">
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="19" cy="12" r="1"></circle>
                                        <circle cx="5" cy="12" r="1"></circle>
                                    </svg>
                                </a>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton5">
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye icon-sm me-2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                        <span class="">View</span>
                                    </a>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2 icon-sm me-2">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                        </svg>
                                        <span class="">Edit</span>
                                    </a>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash icon-sm me-2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        <span class="">Delete</span>
                                    </a>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-printer icon-sm me-2">
                                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                            <rect x="6" y="14" width="12" height="8"></rect>
                                        </svg>
                                        <span class="">Print</span>
                                    </a>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download icon-sm me-2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        <span class="">Download</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div id="storageChart" style={{ minHeight: '238.7px' }}>
                            {/* <div id="apexchartsd876tb8xh" class="apexcharts-canvas apexchartsd876tb8xh apexcharts-theme-light" style="width: 400px; height: 238.7px;">
                  <svg id="SvgjsSvg3659" width="400" height="238.70000000000002" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;">
                     <g id="SvgjsG3661" class="apexcharts-inner apexcharts-graphical" transform="translate(83, 0)">
                        <defs id="SvgjsDefs3660">
                           <clipPath id="gridRectMaskd876tb8xh">
                              <rect id="SvgjsRect3663" width="242" height="260" x="-3" y="-1" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect>
                           </clipPath>
                           <clipPath id="forecastMaskd876tb8xh"></clipPath>
                           <clipPath id="nonForecastMaskd876tb8xh"></clipPath>
                           <clipPath id="gridRectMarkerMaskd876tb8xh">
                              <rect id="SvgjsRect3664" width="240" height="262" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect>
                           </clipPath>
                        </defs>
                        <g id="SvgjsG3665" class="apexcharts-radialbar">
                           <g id="SvgjsG3666">
                              <g id="SvgjsG3667" class="apexcharts-tracks">
                                 <g id="SvgjsG3668" class="apexcharts-radialbar-track apexcharts-track" rel="1">
                                    <path id="apexcharts-radialbarTrack-0" d="M 118 30.93048780487804 A 87.06951219512196 87.06951219512196 0 1 1 117.98480350341804 30.93048913102254" fill="none" fill-opacity="1" stroke="rgba(233,236,239,1)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.36829268292683" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 118 30.93048780487804 A 87.06951219512196 87.06951219512196 0 1 1 117.98480350341804 30.93048913102254"></path>
                                 </g>
                              </g>
                              <g id="SvgjsG3670">
                                 <g id="SvgjsG3675" class="apexcharts-series apexcharts-radial-series" seriesName="StoragexUsed" rel="1" data:realIndex="0">
                                    <path id="SvgjsPath3676" d="M 118 30.93048780487804 A 87.06951219512196 87.06951219512196 0 1 1 41.84728874313238 160.2121371423509" fill="none" fill-opacity="1" stroke="rgba(101,113,255,1)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.368292682926832" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="241" data:value="67" index="0" j="0" data:pathOrig="M 118 30.93048780487804 A 87.06951219512196 87.06951219512196 0 1 1 41.84728874313238 160.2121371423509"></path>
                                 </g>
                                 <circle id="SvgjsCircle3671" r="66.38536585365854" cx="118" cy="118" class="apexcharts-radialbar-hollow" fill="transparent"></circle>
                                 <g id="SvgjsG3672" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;">
                                    <text id="SvgjsText3673" font-family="Helvetica, Arial, sans-serif" x="118" y="107" text-anchor="middle" dominant-baseline="auto" font-size="13px" font-weight="600" fill="#7987a1" class="apexcharts-text apexcharts-datalabel-label" style="font-family: Helvetica, Arial, sans-serif;">Storage Used</text>
                                    <text id="SvgjsText3674" font-family="Helvetica, Arial, sans-serif" x="118" y="150" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="400" fill="#000000" class="apexcharts-text apexcharts-datalabel-value" style="font-family: Helvetica, Arial, sans-serif;">67%</text>
                                 </g>
                              </g>
                           </g>
                        </g>
                        <line id="SvgjsLine3677" x1="0" y1="0" x2="236" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line>
                        <line id="SvgjsLine3678" x1="0" y1="0" x2="236" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line>
                     </g>
                     <g id="SvgjsG3662" class="apexcharts-annotations"></g>
                  </svg>
                  <div class="apexcharts-legend"></div>
               </div> */}
                        </div>
                        <div class="row mb-3">
                            <div class="col-6 d-flex justify-content-end">
                                <div>
                                    <label class="d-flex align-items-center justify-content-end tx-10 text-uppercase fw-bolder">Total storage <span class="p-1 ms-1 rounded-circle bg-secondary"></span></label>
                                    <h5 class="fw-bolder mb-0 text-end">8TB</h5>
                                </div>
                            </div>
                            <div class="col-6">
                                <div>
                                    <label class="d-flex align-items-center tx-10 text-uppercase fw-bolder"><span class="p-1 me-1 rounded-circle bg-primary"></span> Used storage</label>
                                    <h5 class="fw-bolder mb-0">~5TB</h5>
                                </div>
                            </div>
                        </div>
                        <div class="d-grid">
                            <button class="btn btn-primary">Upgrade storage</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PieChart