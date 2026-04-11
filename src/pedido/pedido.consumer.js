import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from '@google-cloud/pubsub';
import { PedidoService } from './pedido.service.js';

@Injectable()
export class PedidoConsumerService {
  constructor(
    @Inject(PedidoService) pedidoService, 
    @Inject(ConfigService) configService
  ) {
    this.pedidoService = pedidoService;
    this.configService = configService;
    this.logger = new Logger(PedidoConsumerService.name);
    this.subscription = null;
  }

  onModuleInit() {
    const subscriptionName = this.configService.get('PUBSUB_SUBSCRIPTION_NAME');

    if (!subscriptionName) {
      this.logger.log('Consumidor Pub/Sub desabilitado. Defina PUBSUB_SUBSCRIPTION_NAME.');
      return;
    }

    const pubsub = new PubSub({
      projectId: this.configService.get('GOOGLE_CLOUD_PROJECT'),
      keyFilename: this.configService.get('GOOGLE_APPLICATION_CREDENTIALS') || undefined,
      apiEndpoint: this.configService.get('PUBSUB_EMULATOR_HOST') || undefined,
    });

    this.subscription = pubsub.subscription(subscriptionName);
    this.subscription.on('message', (message) => {
      this.processarMensagemPubsub(message);
    });
    this.subscription.on('error', (error) => {
      this.logger.error(`Erro no consumidor Pub/Sub: ${error.message}`, error.stack);
    });

    this.logger.log(`Consumidor Pub/Sub iniciado na assinatura ${subscriptionName}.`);
  }

  onModuleDestroy() {
    if (this.subscription) {
      this.subscription.removeAllListeners();
    }
  }

  async processarMensagemPubsub(message) {
    try {
      const payload = JSON.parse(message.data.toString());
      await this.pedidoService.salvarPedidoDoMarketplace(payload);
      message.ack();
      this.logger.log(`Mensagem Pub/Sub processada para pedido ${payload.uuid}.`);
    } catch (error) {
      this.logger.error(`Falha ao processar mensagem Pub/Sub: ${error.message}`, error.stack);
      message.nack();
    }
  }
}