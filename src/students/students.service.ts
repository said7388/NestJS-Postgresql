import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  findAll() {
    return this.studentRepository.find();
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!student) {
      throw new NotFoundException('User not found');
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.preload({
      id: +id,
      ...updateStudentDto,
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
}
