import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import * as helmet from 'helmet'
import * as hpp from 'hpp'
import * as xss from 'xss-clean'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { AppModule } from './app.module'
import { TransformInterceptor } from './interceptors/transform.interceptor'
import { getConnectionManager } from 'typeorm'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  app.setGlobalPrefix('uri')
  app.enableCors()
  app.use(helmet())
  app.use(hpp())
  app.use(xss())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  Sentry.init({
    dsn: configService.get('SENTRY_DSN'),
    release: `${configService.get('npm_package_name')}@${configService.get(
      'npm_package_version',
    )}`,
    environment: configService.get('NODE_ENV'),
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express(),
    ],
    tracesSampleRate: 1.0,
  })

  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
  const connectionManager = getConnectionManager()
  const connection = connectionManager.get('default')
  await connection.runMigrations()
  app.use(Sentry.Handlers.errorHandler())
  await app.listen(configService.get('PORT'))
}
bootstrap()
