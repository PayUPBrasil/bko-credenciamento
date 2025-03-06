import { Component, inject, OnInit } from "@angular/core";
import { BreadcrumbComponent } from "../../../layout/breadcrumb.component";
import { CommonModule } from "@angular/common";


import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';

import { ThemeOption } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import type { EChartsCoreOption } from 'echarts/core';

import { CoolTheme } from "../../../../CoolTheme/cool-theme";
import { MetricsService } from "../../../../../services/metrics/metrics.service";
 import { GetUserLoggedService } from "../../../../../services/utils/getUserData.service";
@Component({
  selector: "app-pages-home",
  imports: [BreadcrumbComponent, CommonModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') }),
    },
  ],
  templateUrl: './home.component.html',
  standalone:true,
})


export class HomeComponent  implements OnInit {

  private metricsService = inject(MetricsService)
  public sumClients = 0
  public sumActiveClients = 0
  public sumPendingClients = 0

  public accreditationOptions!: EChartsCoreOption;
  public accreditationByMonth !: EChartsOption
  public userName : string | null = ''
  private getUserLoggedService = inject(GetUserLoggedService)

   ngOnInit(): void {
    this.getTotalClients()
    this.getTotalActiveClients()
    this.getTotalPendingClients()
    this.getAccreditationBySeller()
    this.getAccreditationByMonth()
    this.getUserName()
  }

  theme!: string | ThemeOption;
  coolTheme = CoolTheme;


  getTotalClients(){
    this.metricsService.totalClients().subscribe({
      next: (data: any) => {
        // console.log(data);
        this.sumClients = data
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    })
  }
  public getUserName() {
    this.userName  = this.getUserLoggedService.userInfo.name;
  }
  getTotalActiveClients(){
    this.metricsService.totalActiveClients().subscribe({
      next: (data: any) => {
        // console.log(data);
        this.sumActiveClients = data
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    })
  }

  getTotalPendingClients(){

    this.metricsService.totalPendingClients().subscribe({
      next: (data: any) => {
        // console.log(data);
        this.sumPendingClients = data
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    })
  }

  getAccreditationBySeller() {
    this.metricsService.getAccreditationBySeller().subscribe({
      next: (data: any) => {
        this.updateAccreditationChart(data);
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }



  getAccreditationByMonth() {
    this.metricsService.getAccreditationByMonth().subscribe({
      next: (data: any) => {
        // console.log(data[0].year, 'by month');


        this.updateAccreditationByMonthChart(data)
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }



  updateAccreditationChart(data: any[]) {
    const chartData = data.map(item => ({
      value: item.clientCount,
      name: item.sellerName
    }));

    this.accreditationOptions = {
      title: {
        top: '5%',
        left: '50%',
        text: 'Credenciamento por comercial',
        textStyle: {
          fontFamily: 'Sora, serif',
          fontSize: 15
        },
        textAlign: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
       legend: {
        textStyle: {
          fontFamily: 'Sora, serif',
          fontSize: 12
        },
      bottom: 10,
      data: chartData,
    },

      calculable: true,
      series: [
        {
          name: 'Credenciamentos',
          type: 'pie',
          radius: [30, 110],
          roseType: 'area',
          data: chartData,
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            fontFamily: 'Sora, serif', // Mova estas propriedades para cá
            fontSize: 12
          },
          emphasis: {
            label: {
              fontWeight: 'bold',
              fontFamily: 'Sora, serif'
            }
          }
        },
      ],

    };
  }

  updateAccreditationByMonthChart(data: any[]) {
    // console.log(data, 'dados que a função updateAccreditationByMonthChart recebeu')
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const values = new Array(12).fill(0);

    data.forEach(item => {
      const monthIndex = item.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        values[monthIndex] = item.count;
      }
    });


    this.accreditationByMonth = {
      loading: false,
      backgroundColor: '#fff',
      title: {
        top: '5%',
        left: '50%',
        text: 'Credenciamentos Mensais (2025)',
        textStyle: {
          fontFamily: 'Sora, sans-serif',
          fontSize: 15
        },
        textAlign: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const value = params[0].value;
          const month = params[0].name;
          return `${month}: ${value} credenciamento${value !== 1 ? 's' : ''}`;
        }
      },
      legend: {
        textStyle: {
          fontFamily: 'Sora, sans-serif',
          fontSize: 10
        },
      bottom: 10,
    },
      xAxis: {
        type: 'category',
        data: months,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: values,
          type: 'line',
          smooth: true,
          symbol: 'square',
        symbolSize: 8,
        itemStyle: {
          color: '#5470C6'
        },
        lineStyle: {
          width: 2
        }
        },
      ],
    };
  }

}
