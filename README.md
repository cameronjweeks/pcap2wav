# RTP Stream to WAV Converter

This utility allows you to convert RTP streams captured in PCAP files to WAV audio files.

## Setup Instructions

### 1. Prerequisites

Before starting, ensure you have the following installed:

- Wireshark
- tshark
- sox

```bash
sudo apt-get update
sudo apt-get install wireshark tshark sox
```

### 2. Running the Script

1. Place your PCAP files in the `pcaps/` directory.
2. Run the script:

```bash
node index.js
```

Uplaod your pcap files into the `pcaps/` directory. After execution, check the `wavFiles/` directory for the converted audio files.
