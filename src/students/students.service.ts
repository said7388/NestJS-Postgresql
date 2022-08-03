import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto, PaginationDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Subject } from './entities/subject.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const subject = await Promise.all(
      createStudentDto.subject.map((name) => this.preloadSubjectByName(name)),
    );

    const student = this.studentRepository.create({
      ...createStudentDto,
      subject,
    });
    return this.studentRepository.save(student);
  }

  findAll(paginate: PaginationDto) {
    const { limit, offset } = paginate;
    return this.studentRepository.find({
      skip: offset,
      take: limit,
      relations: ['subject'],
    });
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['subject'],
    });
    if (!student) {
      throw new NotFoundException('User not found');
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const subject =
      updateStudentDto.subject &&
      (await Promise.all(
        updateStudentDto.subject.map((name) => this.preloadSubjectByName(name)),
      ));

    const student = await this.studentRepository.preload({
      id: +id,
      ...updateStudentDto,
      subject,
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return this.studentRepository.save(student);
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    return this.studentRepository.remove(student);
  }

  private async preloadSubjectByName(name: string) {
    const existingSubject = await this.subjectRepository.findOne({
      where: { name: name },
    });
    if (existingSubject) {
      return existingSubject;
    }
    return this.subjectRepository.create({ name });
  }
}
