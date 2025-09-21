import 'package:flutter/material.dart';

class Step1Screen extends StatefulWidget {
  const Step1Screen({super.key});

  @override
  State<Step1Screen> createState() => _Step1ScreenState();
}

class _Step1ScreenState extends State<Step1Screen> {
  // Parameters
  double conveyorSpeed = 1.2; // m/s
  double materialTonnage = 500; // T/hr
  double motorTemp = 65; // °C
  double vibrationHz = 32.5; // Hz
  double moisture = 8.5; // %
  List<Map<String, dynamic>> particleSizeDistribution = [
    {"size": "<30mm", "percentage": 15.0},
    {"size": "30-45mm", "percentage": 45.0},
    {"size": "45-60mm", "percentage": 30.0},
    {"size": ">60mm", "percentage": 10.0},
  ];

  List<Map<String, String>> alerts = [];

  void _sendData(String sensor, dynamic value) {
    setState(() {
      // Add new alert if abnormal
      if (sensor == "Vibration" && vibrationHz > 40) {
        alerts.add({"severity": "warning", "message": "⚠️ High vibration detected"});
      } else if (sensor == "Moisture" && moisture > 12) {
        alerts.add({"severity": "info", "message": "ℹ️ High moisture level"});
      } else {
        alerts.add({"severity": "success", "message": "✅ $sensor sent successfully"});
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('✅ Sent $sensor = $value to server'),
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.indigo.shade600,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Step 1 — Raw Material Extraction'),
        backgroundColor: Colors.indigo,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildConveyorSpeedCard(),
            _buildSliderCard(
              title: "Material Tonnage (Feed Rate)",
              unit: "T/hr",
              min: 100,
              max: 1000,
              value: materialTonnage,
              onChanged: (val) => setState(() => materialTonnage = val),
              onSend: () => _sendData(
                  "Material Tonnage", "${materialTonnage.toStringAsFixed(0)} T/hr"),
            ),
            _buildSliderCard(
              title: "Motor Temperature",
              unit: "°C",
              min: 20,
              max: 120,
              value: motorTemp,
              onChanged: (val) => setState(() => motorTemp = val),
              onSend: () => _sendData(
                  "Motor Temperature", "${motorTemp.toStringAsFixed(1)} °C"),
            ),
            _buildVibrationCard(),
            _buildMoistureCard(),
            _buildParticleSizeCard(),
            _buildAlertsCard(),
          ],
        ),
      ),
    );
  }

  /// Conveyor Speed card
  Widget _buildConveyorSpeedCard() {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Icon(Icons.settings, color: Colors.indigo, size: 22),
                SizedBox(width: 8),
                Text(
                  "Conveyor Speed",
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Slider(
              value: conveyorSpeed,
              min: 0.5,
              max: 5.0,
              divisions: 45,
              activeColor: Colors.indigo,
              onChanged: (val) => setState(() => conveyorSpeed = val),
            ),
            Center(
              child: Text(
                "${conveyorSpeed.toStringAsFixed(2)} m/s",
                style: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 10),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () => _sendData(
                    "Conveyor Speed", "${conveyorSpeed.toStringAsFixed(2)} m/s"),
                icon: const Icon(Icons.cloud_upload, size: 18),
                label: const Text("Send"),
              ),
            )
          ],
        ),
      ),
    );
  }

  /// Generic slider-based sensor widget
  Widget _buildSliderCard({
    required String title,
    required String unit,
    required double min,
    required double max,
    required double value,
    required ValueChanged<double> onChanged,
    required VoidCallback onSend,
  }) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style:
                    const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: Slider(
                    value: value,
                    min: min,
                    max: max,
                    divisions: 50,
                    activeColor: Colors.indigo,
                    label: "${value.toStringAsFixed(1)} $unit",
                    onChanged: onChanged,
                  ),
                ),
                Text("${value.toStringAsFixed(1)} $unit",
                    style: const TextStyle(fontWeight: FontWeight.w600)),
              ],
            ),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: onSend,
                icon: const Icon(Icons.cloud_upload),
                label: const Text("Send"),
              ),
            )
          ],
        ),
      ),
    );
  }

  /// Vibration card (numeric instead of toggle)
  Widget _buildVibrationCard() {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Crusher Vibration (Hz)",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Slider(
              value: vibrationHz,
              min: 10,
              max: 60,
              divisions: 50,
              activeColor: vibrationHz > 40 ? Colors.red : Colors.green,
              onChanged: (val) => setState(() => vibrationHz = val),
            ),
            Text("${vibrationHz.toStringAsFixed(1)} Hz",
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: vibrationHz > 40 ? Colors.red : Colors.green,
                )),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: () =>
                    _sendData("Vibration", "${vibrationHz.toStringAsFixed(1)} Hz"),
                icon: const Icon(Icons.cloud_upload),
                label: const Text("Send"),
              ),
            )
          ],
        ),
      ),
    );
  }

  /// Moisture content card
  Widget _buildMoistureCard() {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Moisture Content",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Slider(
              value: moisture,
              min: 0,
              max: 20,
              divisions: 20,
              activeColor: Colors.orange,
              onChanged: (val) => setState(() => moisture = val),
            ),
            Text("${moisture.toStringAsFixed(1)} %",
                style: const TextStyle(fontWeight: FontWeight.w600)),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: () =>
                    _sendData("Moisture", "${moisture.toStringAsFixed(1)} %"),
                icon: const Icon(Icons.cloud_upload),
                label: const Text("Send"),
              ),
            )
          ],
        ),
      ),
    );
  }

  /// Particle size distribution card
  Widget _buildParticleSizeCard() {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Particle Size Distribution",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Column(
              children: particleSizeDistribution.map((item) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(item["size"]),
                          Text("${item["percentage"].toStringAsFixed(1)} %"),
                        ],
                      ),
                      LinearProgressIndicator(
                        value: item["percentage"] / 100,
                        color: Colors.blue,
                        minHeight: 8,
                        borderRadius: BorderRadius.circular(5),
                      )
                    ],
                  ),
                );
              }).toList(),
            ),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: () => _sendData("Particle Size Distribution",
                    particleSizeDistribution.toString()),
                icon: const Icon(Icons.cloud_upload),
                label: const Text("Send"),
              ),
            )
          ],
        ),
      ),
    );
  }

  /// Alerts card
  Widget _buildAlertsCard() {
    if (alerts.isEmpty) return const SizedBox.shrink();

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Alerts",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Column(
              children: alerts.map((alert) {
                Color color;
                if (alert["severity"] == "warning") {
                  color = Colors.orange;
                } else if (alert["severity"] == "info") {
                  color = Colors.blue;
                } else {
                  color = Colors.green;
                }
                return Container(
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: color)),
                  child: Row(
                    children: [
                      Icon(Icons.info, color: color),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(alert["message"]!,
                            style: TextStyle(color: color)),
                      )
                    ],
                  ),
                );
              }).toList(),
            )
          ],
        ),
      ),
    );
  }
}
