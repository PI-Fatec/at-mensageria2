import { PubSub } from '@google-cloud/pubsub';
import { pedidoService } from '../services/pedido.service.js';

export function iniciarConsumidorPedidos() {
  const subscriptionName = process.env.PUBSUB_SUBSCRIPTION_NAME;

  if (!subscriptionName) {
    console.log('Consumidor Pub/Sub desabilitado (PUBSUB_SUBSCRIPTION_NAME vazio).');
    return;
  }

  const pubsub = new PubSub({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || undefined,
    apiEndpoint: process.env.PUBSUB_EMULATOR_HOST || undefined,
  });

  const subscription = pubsub.subscription(subscriptionName);

  subscription.on('message', async (message) => {
    try {
      const payload = JSON.parse(message.data.toString());
      await pedidoService.salvarPedidoDoMarketplace(payload);
      message.ack();
      console.log(`Pedido ${payload.uuid} processado com sucesso.`);
    } catch (error) {
      message.nack();
      console.error('Erro ao processar mensagem Pub/Sub:', error.message);
    }
  });

  subscription.on('error', (error) => {
    console.error('Erro no consumidor Pub/Sub:', error.message);
  });

  console.log(`Consumidor Pub/Sub ativo na assinatura ${subscriptionName}.`);
}
