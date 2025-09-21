// lib/screen/step7.dart
import 'package:flutter/material.dart';

class Step7Screen extends StatefulWidget {
  const Step7Screen({super.key});

  @override
  State<Step7Screen> createState() => _Step7ScreenState();
}

class _Step7ScreenState extends State<Step7Screen> {
  // Example storage values
  double storageLevel = 65; // % filled
  double storageTemp = 80; // °C
  double dischargeRate = 250; // T/hr
  bool dustSuppressionActive = true;
  List<String> alerts = [];

  void sendData(String key, dynamic value) {
    debugPrint("✅ Sent $key = $value to server");
    // TODO: Replace with real API or socket call
  }

  void _sendAll() {
    sendData("Storage Level", "$storageLevel %");
    sendData("Storage Temperature", "$storageTemp °C");
    sendData("Discharge Rate", "$dischargeRate T/hr");
    sendData("Dust Suppression", dustSuppressionActive ? "Active" : "Inactive");
    sendData("Alerts", alerts.isEmpty ? "None" : alerts.join(", "));
  }

  String getLevelStatus() {
    if (storageLevel > 90) return "Warning: Near Overflow";
    if (storageLevel < 20) return "Warning: Low Level";
    return "Stable";
  }

  String getTempStatus() {
    if (storageTemp > 120) return "Overheating Risk";
    if (storageTemp < 50) return "Too Cold";
    return "Optimal";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 7 — Clinker Storage"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Storage Level
            Card(
              child: ListTile(
                leading: const Icon(Icons.inventory, color: Colors.blueGrey),
                title: const Text("Storage Level"),
                subtitle: Text("$storageLevel % — ${getLevelStatus()}"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value =
                        await _showInputDialog("Storage Level (0–100%)", storageLevel.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 0 && val <= 100) {
                        setState(() => storageLevel = val);
                        sendData("Storage Level", "$storageLevel %");
                      }
                    }
                  },
                ),
              ),
            ),

            // Storage Temperature
            Card(
              child: ListTile(
                leading: const Icon(Icons.thermostat, color: Colors.red),
                title: const Text("Storage Temperature"),
                subtitle: Text("$storageTemp °C — ${getTempStatus()}"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog(
                        "Storage Temperature (30–150 °C)", storageTemp.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 30 && val <= 150) {
                        setState(() => storageTemp = val);
                        sendData("Storage Temperature", "$storageTemp °C");
                      }
                    }
                  },
                ),
              ),
            ),

            // Discharge Rate
            Card(
              child: ListTile(
                leading: const Icon(Icons.speed, color: Colors.green),
                title: const Text("Discharge Rate"),
                subtitle: Text("$dischargeRate T/hr"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog(
                        "Discharge Rate (50–500 T/hr)", dischargeRate.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 50 && val <= 500) {
                        setState(() => dischargeRate = val);
                        sendData("Discharge Rate", "$dischargeRate T/hr");
                      }
                    }
                  },
                ),
              ),
            ),

            // Dust Suppression
            Card(
              child: SwitchListTile(
                title: const Text("Dust Suppression"),
                subtitle: Text(dustSuppressionActive ? "Active" : "Inactive"),
                value: dustSuppressionActive,
                onChanged: (val) {
                  setState(() => dustSuppressionActive = val);
                  sendData("Dust Suppression", dustSuppressionActive ? "Active" : "Inactive");
                },
              ),
            ),

            const SizedBox(height: 16),

            // Alerts
            if (alerts.isNotEmpty)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: alerts
                    .map(
                      (a) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            const Icon(Icons.warning, color: Colors.orange),
                            const SizedBox(width: 8),
                            Expanded(child: Text(a)),
                          ],
                        ),
                      ),
                    )
                    .toList(),
              ),

            const Spacer(),

            ElevatedButton.icon(
              onPressed: _sendAll,
              icon: const Icon(Icons.send),
              label: const Text("Send All Data"),
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
            ),
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
