FROM quay.io/loki-xer/jarvis-md:latest

# Clone the original Loki-Xer/Jarvis repo
RUN git clone https://github.com/Loki-Xer/Jarvis.git /root/Jarvis/

# Clone your repo (Tanjiro2130K/sec)
RUN git clone https://github.com/Tanjiro2130K/sec.git /root/sec/

# Install dependencies for Loki-Xer/Jarvis
WORKDIR /root/Jarvis/
RUN yarn install --network-concurrency 1

# Install dependencies for Tanjiro2130K/sec (your repo)
WORKDIR /root/sec/
RUN yarn install --network-concurrency 1

# Set working directory to your repo (Tanjiro2130K/sec) and start your application
WORKDIR /root/sec/
CMD ["npm", "start"]
