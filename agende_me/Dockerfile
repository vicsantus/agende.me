# Dockerfile
FROM node:18

# Instala o JDK (necessário para o desenvolvimento com Android)
RUN apt-get update && \
  apt-get install -y openjdk-17-jdk && \
  apt-get install -y unzip wget && \
  apt-get clean;

# Instala watchman, que é útil para o monitoramento de arquivos em React Native
RUN apt-get update && \
  apt-get install -y watchman && \
  apt-get clean;

# Define variáveis de ambiente para o Android SDK
ENV ANDROID_SDK_ROOT /usr/local/android-sdk-linux
ENV PATH $PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin
ENV PATH $PATH:$ANDROID_SDK_ROOT/platform-tools

# ENV ANDROID_SDK_ROOT=/usr/local/android-sdk
ENV PATH="${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools"


# Baixa e instala o SDK do Android (usando apenas a linha de comando para reduzir a imagem)
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
  cd $ANDROID_SDK_ROOT/cmdline-tools && \
  wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
  unzip commandlinetools-linux-9477386_latest.zip -d latest && \
  rm commandlinetools-linux-9477386_latest.zip && \
  yes | sdkmanager --licenses && \
  sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

# Define o diretório de trabalho e copia o código do projeto
WORKDIR /app
COPY . /app

# Instala as dependências do projeto
RUN npm install

# Expõe a porta de desenvolvimento do Metro Bundler (8081)
EXPOSE 8081

# Comando padrão para iniciar o Metro Bundler
CMD ["npm", "start"]
