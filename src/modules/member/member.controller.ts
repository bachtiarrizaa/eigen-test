import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMemberUseCase } from './application/use-cases/get-members.use-case';
import { CreateMemberUseCase } from './application/use-cases/create-member.use-case';
import { UpdateMemberUseCase } from './application/use-cases/update-member.use-case';
import { DeleteMemberUseCase } from './application/use-cases/delete-member.use-case';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import {
  CreateMemberDto,
  UpdateMemberDto,
} from './application/dtos/member.dto';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(
    private readonly getMembersUseCase: GetMemberUseCase,
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly updateMemberUseCase: UpdateMemberUseCase,
    private readonly deleteMemberUseCase: DeleteMemberUseCase,
  ) {}

  @Get()
  @ResponseMessage('Members retrieved successfully')
  @ApiOperation({
    summary: 'Get all members and the number of books they are borrowing',
  })
  @ApiResponse({ status: 200, description: 'Return all members.' })
  async findAll() {
    return this.getMembersUseCase.execute();
  }

  @Post()
  @ResponseMessage('Member created successfully')
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'Member created successfully.' })
  async create(@Body() dto: CreateMemberDto) {
    return this.createMemberUseCase.execute(dto);
  }

  @Put(':id')
  @ResponseMessage('Member updated successfully')
  @ApiOperation({ summary: 'Update an existing member' })
  @ApiResponse({ status: 200, description: 'Member updated successfully.' })
  async update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.updateMemberUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ResponseMessage('Member deleted successfully')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiResponse({ status: 200, description: 'Member deleted successfully.' })
  async delete(@Param('id') id: string) {
    return this.deleteMemberUseCase.execute(id);
  }
}
