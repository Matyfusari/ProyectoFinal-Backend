// const pino = require('pino')
import pino from 'pino'

const loggerDesarrollo = pino({ level: 'debug' })

const loggerProduccion = pino({ level: 'warn' },pino.destination('./warn.log'),{ level: 'error' },pino.destination('./error.log'));

const logger = process.env.NODE_ENV === 'PROD' ? loggerProduccion : loggerDesarrollo;

export default logger;