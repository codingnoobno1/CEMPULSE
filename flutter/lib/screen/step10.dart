import 'package:flutter/material.dart';

class Step10Screen extends StatelessWidget {
  const Step10Screen({super.key});

  // Sample cement storage data
  Map<String, dynamic> generateSampleData() {
    return {
      "silos": [
        {
          "id": 1,
          "type": "OPC",
          "capacity": 5000,
          "currentLevel": 3850,
          "temperature": 28,
          "humidity": 0.5,
          "status": "operational"
        },
        {
          "id": 2,
          "type": "PPC",
          "capacity": 4000,
          "currentLevel": 2100,
          "temperature": 29,
          "humidity": 0.6,
          "status": "operational"
        },
        {
          "id": 3,
          "type": "PSC",
          "capacity": 3000,
          "currentLevel": 450,
          "temperature": 27,
          "humidity": 0.7,
          "status": "low_inventory"
        }
      ],
      "alerts": [
        {"severity": "warning", "message": "Silo 3 (PSC) inventory below 20%"},
        {"severity": "info", "message": "Scheduled maintenance for Silo 2 tomorrow"},
      ],
    };
  }

  Color _getStatusColor(double percentage) {
    if (percentage < 20) return Colors.red;
    if (percentage < 40) return Colors.orange;
    return Colors.green;
  }

  @override
  Widget build(BuildContext context) {
    final data = generateSampleData();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 10 - Cement Storage Sensors"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Storage Silos Status",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),

            // Silo cards
            ...data["silos"].map<Widget>((silo) {
              final percentage =
                  (silo["currentLevel"] / silo["capacity"]) * 100.0;

              return Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 3,
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text("Silo ${silo["id"]} - ${silo["type"]}",
                              style: const TextStyle(
                                  fontSize: 14, fontWeight: FontWeight.w600)),
                          Chip(
                            label: Text(
                              silo["status"] == "operational"
                                  ? "Operational"
                                  : "Low Inventory",
                            ),
                            backgroundColor: silo["status"] == "operational"
                                ? Colors.green[100]
                                : Colors.orange[100],
                            labelStyle: TextStyle(
                                color: silo["status"] == "operational"
                                    ? Colors.green[900]
                                    : Colors.orange[900]),
                          )
                        ],
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(
                        value: percentage / 100,
                        minHeight: 10,
                        color: _getStatusColor(percentage),
                        backgroundColor: Colors.grey[300],
                        borderRadius: BorderRadius.circular(5),
                      ),
                      const SizedBox(height: 6),
                      Text(
                          "${silo["currentLevel"]}t / ${silo["capacity"]}t  (${percentage.toStringAsFixed(1)}%)"),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.thermostat, size: 18),
                              const SizedBox(width: 4),
                              Text("${silo["temperature"]}°C"),
                            ],
                          ),
                          Row(
                            children: [
                              const Icon(Icons.water_drop, size: 18),
                              const SizedBox(width: 4),
                              Text("${(silo["humidity"] * 100).toStringAsFixed(1)}%"),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }),

            const SizedBox(height: 20),
            const Text("Alerts",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),

            // Alerts
            ...data["alerts"].map<Widget>((alert) {
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                color: alert["severity"] == "warning"
                    ? Colors.orange[50]
                    : Colors.blue[50],
                child: ListTile(
                  leading: Icon(
                    alert["severity"] == "warning"
                        ? Icons.warning
                        : Icons.info_outline,
                    color: alert["severity"] == "warning"
                        ? Colors.orange
                        : Colors.blue,
                  ),
                  title: Text(alert["message"]),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
