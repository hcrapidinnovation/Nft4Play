import { Logger } from 'winston'

import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.log('error', 'unhandledRejection', {
        message: `Unhandled Rejection at Promise ${promise}`,
      })
      this.logger.log('error', 'unhandledRejection', {
        message: JSON.stringify({ reason }, null, 2),
      })
    })

    process.on('uncaughtException', function (error) {
      this.logger.log('error', 'uncaughtException', {
        message: 'Uncaught Exception',
      })
      this.logger.log('error', 'uncaughtException', {
        message: JSON.stringify({ error }, null, 2),
      })
    })

    process.on('SIGINT', function () {
      this.logger.log('error', 'SIGINT', { message: 'Server Status: Inactive' })
      process.exit(0)
    })

    next()
  }
}
