providers: [
  { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  { provide: APP_FILTER, useClass: AllExceptionsFilter },
  { provide: APP_FILTER, useClass: HttpExceptionFilter },
  { provide: APP_PIPE, useClass: ValidationPipe },
];
