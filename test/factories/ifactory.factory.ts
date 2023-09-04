import { PrismaService } from '@app/prisma/prisma.service';

export interface IFactory<Dto, PrismaEntity> {
  build: (props?: Partial<Dto>) => Dto;
  persist: (prisma: PrismaService, ...props: any[]) => Promise<PrismaEntity>;
}
