const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const unlinkAsync = util.promisify(fs.unlink);

async function extractSSRCs(pcapFile) {
	const command = `tshark -r ${pcapFile} -T fields -e rtp.ssrc -Y rtp | sort | uniq`;

	try {
		const { stdout } = await exec(command);
		return stdout.trim().split('\n');
	} catch (error) {
		console.error('Error extracting SSRCs:', error);
	}
}

async function convertSSRCtoWAV(pcapFile, ssrc) {
	const rtpDataFile = `rtpdata_${ssrc}.raw`;
	const wavFile = `./wavFiles/output_${ssrc}.wav`;
	const extractCommand = `tshark -r ${pcapFile} -T fields -e rtp.payload -Y "rtp.ssrc == ${ssrc}" | tr -d '\\n' | xxd -r -p > ${rtpDataFile}`;

	try {
		await exec(extractCommand);

		const convertCommand = `sox -t raw -r 8000 -e u-law -b 8 -c 1 ${rtpDataFile} ${wavFile}`;
		await exec(convertCommand);

		await unlinkAsync(rtpDataFile);
		console.log(
			`Deleted temporary rtp data file: ${rtpDataFile}`,
		);
		console.log(`Converted ${ssrc} to ${wavFile}`);
	} catch (error) {
		console.error(
			'Error during conversion process:',
			error,
		);
	}
}

async function run(pcapFile) {
	try {
		const ssrcValues = await extractSSRCs(pcapFile);
		for (const ssrc of ssrcValues) {
			await convertSSRCtoWAV(pcapFile, ssrc);
			console.log(`Processed SSRC: ${ssrc}`);
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

const pcapFile = './pcaps/input.pcap';
run(pcapFile);
