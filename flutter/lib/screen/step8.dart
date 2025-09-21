// lib/screen/step8.dart
import 'package:flutter/material.dart';

class Step8Screen extends StatefulWidget {
  const Step8Screen({super.key});

  @override
  State<Step8Screen> createState() => _Step8ScreenState();
}

class _Step8ScreenState extends State<Step8Screen> {
  double millLoad = 70; // %
  double grindingTemp = 95; // °C
  double motorPower = 4800; // kW
  double blaineFineness = 320; // m²/kg
  bool separatorActive = true;
  List<String> alerts = [];

  void sendData(String key, dynamic value) {
    debugPrint("✅ Sent $key = $value to server");
    // TODO: replace with API call
  }

  void _sendAll() {
    sendData("Mill Load", "$millLoad %");
    sendData("Grinding Temperature", "$grindingTemp °C");
    sendData("Motor Power", "$motorPower kW");
    sendData("Blaine Fineness", "$blaineFineness m²/kg");
    sendData("Separator", separatorActive ? "Active" : "Inactive");
    sendData("Alerts", alerts.isEmpty ? "None" : alerts.join(", "));
  }

  String getMillStatus() {
    if (millLoad > 90) return "Overloaded";
    if (millLoad < 40) return "Underloaded";
    return "Optimal";
  }

  String getTempStatus() {
    if (grindingTemp > 110) return "Overheating Risk";
    if (grindingTemp < 60) return "Too Low";
    return "Stable";
  }

  String getFinenessStatus() {
    if (blaineFineness < 280) return "Coarse";
    if (blaineFineness > 400) return "Too Fine";
    return "Target Achieved";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 8 — Cement Grinding"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Mill Load
            Card(
              child: ListTile(
                leading: const Icon(Icons.precision_manufacturing, color: Colors.blue),
                title: const Text("Mill Load"),
                subtitle: Text("$millLoad % — ${getMillStatus()}"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog("Mill Load (0–100%)", millLoad.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 0 && val <= 100) {
                        setState(() => millLoad = val);
                        sendData("Mill Load", "$millLoad %");
                      }
                    }
                  },
                ),
              ),
            ),

            // Grinding Temperature
            Card(
              child: ListTile(
                leading: const Icon(Icons.thermostat, color: Colors.red),
                title: const Text("Grinding Temperature"),
                subtitle: Text("$grindingTemp °C — ${getTempStatus()}"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog("Grinding Temp (50–130 °C)", grindingTemp.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 50 && val <= 130) {
                        setState(() => grindingTemp = val);
                        sendData("Grinding Temperature", "$grindingTemp °C");
                      }
                    }
                  },
                ),
              ),
            ),

            // Motor Power
            Card(
              child: ListTile(
                leading: const Icon(Icons.bolt, color: Colors.orange),
                title: const Text("Motor Power"),
                subtitle: Text("$motorPower kW"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog("Motor Power (1000–7000 kW)", motorPower.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 1000 && val <= 7000) {
                        setState(() => motorPower = val);
                        sendData("Motor Power", "$motorPower kW");
                      }
                    }
                  },
                ),
              ),
            ),

            // Blaine Fineness
            Card(
              child: ListTile(
                leading: const Icon(Icons.texture, color: Colors.green),
                title: const Text("Blaine Fineness"),
                subtitle: Text("$blaineFineness m²/kg — ${getFinenessStatus()}"),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final value = await _showInputDialog("Blaine Fineness (250–450 m²/kg)", blaineFineness.toString());
                    if (value != null) {
                      final val = double.tryParse(value);
                      if (val != null && val >= 250 && val <= 450) {
                        setState(() => blaineFineness = val);
                        sendData("Blaine Fineness", "$blaineFineness m²/kg");
                      }
                    }
                  },
                ),
              ),
            ),

            // Separator
            Card(
              child: SwitchListTile(
                title: const Text("Separator"),
                subtitle: Text(separatorActive ? "Active" : "Inactive"),
                value: separatorActive,
                onChanged: (val) {
                  setState(() => separatorActive = val);
                  sendData("Separator", separatorActive ? "Active" : "Inactive");
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
