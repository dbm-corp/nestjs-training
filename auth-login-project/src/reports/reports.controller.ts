// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Serialize(ReportDto)
  createPost(@Body() body: CreateReportDto, @Request() req) {
    return this.reportsService.create(body, req);
  }
}
