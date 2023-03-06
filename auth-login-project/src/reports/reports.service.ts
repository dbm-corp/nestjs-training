import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, req) {
    const report = this.reportRepo.create(reportDto);
    report.user = req.user;

    return this.reportRepo.save(report);
  }
}
