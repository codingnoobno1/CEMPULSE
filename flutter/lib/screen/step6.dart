// lib/screen/step6.dart
import 'package:flutter/material.dart';

class Step6Screen extends StatefulWidget {
  const Step6Screen({super.key});

  @override
  State<Step6Screen> createState() => _Step6ScreenState();
}

class _Step6ScreenState extends State<Step6Screen> {
  // Example process values
  double kilnTemp = 1350; // °C
  double rotationSpeed = 2.5; // rpm
  double fuelFeedRate = 1200; // kg/hr
  List<String> alerts = [];

  // Helpers
  String getTempStatus() {
    if (kilnTemp > 1450) return "Danger: Overheating";
    if (kilnTemp > 1400) return "Warning: High Temp";
    if (kilnTemp < 1300) return "Warning: Low Temp";
    return "Stable";
  }

  void sendData(String key, dynamic value) {
    debugPrint("✅ Sent $key = $value to server");
    // TODO: replace with API call or socket send
  }

  void _sendAll() {
    sendData("Kiln Temperature", "$kilnTemp °C");
    sendData("Rotation Speed", "$rotationSpeed rpm");
    sendData("Fuel Feed Rate", "$fuelFeedRate kg/hr");
    sendData("Alerts", alerts.isEmpty ? "None" : alerts.join(", "));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 6 — Kiln Operation"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Temperature
            Card(
              child: ListTile(
                leading: const Icon(Icons.local_fire_department, color: Colors.red),
                title: const Text("Kiln Temperature"),
                subtitle: Text("$kilnTemp °C — ${getTempStatus()}"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog("Kiln Temperature (1200–1500)", kilnTemp.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 1200 && val <= 1500) {
                        setState(() => kilnTemp = val);
                        sendData("Kiln Temperature", "$kilnTemp °C");
                      }
                    }
                  },
                ),
              ),
            ),

            // Rotation Speed
            Card(
              child: ListTile(
                leading: const Icon(Icons.rotate_right, color: Colors.blue),
                title: const Text("Rotation Speed"),
                subtitle: Text("$rotationSpeed rpm"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog("Rotation Speed (0–5 rpm)", rotationSpeed.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 0 && val <= 5) {
                        setState(() => rotationSpeed = val);
                        sendData("Rotation Speed", "$rotationSpeed rpm");
                      }
                    }
                  },
                ),
              ),
            ),

            // Fuel Feed
            Card(
              child: ListTile(
                leading: const Icon(Icons.local_gas_station, color: Colors.green),
                title: const Text("Fuel Feed Rate"),
                subtitle: Text("$fuelFeedRate kg/hr"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog("Fuel Feed Rate (0–2000 kg/hr)", fuelFeedRate.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 0 && val <= 2000) {
                        setState(() => fuelFeedRate = val);
                        sendData("Fuel Feed Rate", "$fuelFeedRate kg/hr");
                      }
                    }
                  },
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Alerts
            if (alerts.isNotEmpty)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: alerts.map((a) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      const Icon(Icons.warning, color: Colors.orange),
                      const SizedBox(width: 8),
                      Expanded(child: Text(a)),
                    ],
                  ),
                )).toList(),
              ),

            const Spacer(),

            ElevatedButton.icon(
              onPressed: _sendAll,
              icon: const Icon(Icons.send),
              label: const Text("Send All Data"),
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
            )
          ],
        ),
      ),
    );
  }

  Future<String?> _showInputDialog(String label, String currentValue) async {
    final controller = TextEditingController(text: currentValue);
    return showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(label),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(hintText: "Enter value"),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
          TextButton(onPressed: () => Navigator.pop(ctx, controller.text), child: const Text("OK")),
        ],
      ),
    );
  }
}
