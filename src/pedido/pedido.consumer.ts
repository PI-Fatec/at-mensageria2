import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidoService } from './pedido.service';

@Injectable()
export class PedidoConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PedidoConsumerService.name);
  private subscription?: Subscription;

  constructor(
    private readonly pedidoService: PedidoService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const subscriptionName = this.configService.get<string>('PUBSUB_SUBSCRIPTION_NAME');

    if (!subscriptionName) {
      this.logger.log('Consumidor Pub/Sub desabilitado. Defina PUBSUB_SUBSCRIPTION_NAME para ativar a assinatura real.');
      return;
    }

    const pubsub = new PubSub({
      projectId: this.configService.get<string>('GOOGLE_CLOUD_PROJECT'),
      keyFilename: this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS') || undefined,
      apiEndpoint: this.configService.get<string>('PUBSUB_EMULATOR_HOST') || undefined,
    });

    this.subscription = pubsub.subscription(subscriptionName);
    this.subscription.on('message', (message) => {
      void this.processarMensagemPubsub(message);
    });
    this.subscription.on('error', (error: Error) => {
      this.logger.error(`Erro no consumidor Pub/Sub: ${error.message}`, error.stack);
    });

    this.logger.log(`Consumidor Pub/Sub iniciado para a assinatura ${subscriptionName}.`);
  }

  onModuleDestroy() {
    this.subscription?.removeAllListeners();
  }


  private async processarMensagemPubsub(message: Message) {
    try {
      const payload = JSON.parse(message.data.toString()) as CreatePedidoDto;
      await this.pedidoService.salvarPedidoDoMarketplace(payload);
      message.ack();
      this.logger.log(`Mensagem Pub/Sub processada com sucesso para pedido ${payload.uuid}.`);
    } catch (error) {
      const typedError = error as Error;
      this.logger.error(`Falha ao processar mensagem Pub/Sub: ${typedError.message}`, typedError.stack);
      message.nack();
    }
  }
}
