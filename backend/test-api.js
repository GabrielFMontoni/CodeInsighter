import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.models) {
      console.log('\n✅ Modelos disponíveis na sua chave:\n');
      data.models.forEach(model => {
        console.log(`Nome: ${model.name}`);
        console.log(`Display Name: ${model.displayName}`);
        console.log(`Métodos suportados: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('---');
      });
    } else {
      console.log('❌ Resposta da API:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

listModels();