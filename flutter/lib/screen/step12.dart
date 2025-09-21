import 'package:flutter/material.dart';

class Step12Screen extends StatelessWidget {
  const Step12Screen({super.key});

  @override
  Widget build(BuildContext context) {
    final cementParams = [
      {"name": "Bag Weight", "value": "50.1 kg", "status": "OK"},
      {"name": "Moisture Content", "value": "0.4 %", "status": "OK"},
      {"name": "Fineness", "value": "320 m²/kg", "status": "OK"},
      {"name": "Setting Time", "value": "150 min", "status": "Alert"},
      {"name": "Strength (28d)", "value": "53 MPa", "status": "OK"},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 12 - Quality Control"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Quality Control - Cement Parameters",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            const Text(
              "Sensor readings and quality parameters are continuously monitored "
              "to ensure product consistency and compliance with standards.",
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: cementParams.length,
                itemBuilder: (context, index) {
                  final param = cementParams[index];
                  return Card(
                    elevation: 2,
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    child: ListTile(
                      leading: Icon(
                        param["status"] == "OK"
                            ? Icons.check_circle
                            : Icons.warning_amber,
                        color: param["status"] == "OK"
                            ? Colors.green
                            : Colors.red,
                      ),
                      title: Text(param["name"] ?? ""),
                      subtitle: Text("Value: ${param["value"]}"),
                      trailing: Text(
                        param["status"] ?? "",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: param["status"] == "OK"
                              ? Colors.green
                              : Colors.red,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Detailed QC Report Generated"),
                  ),
                );
              },
              icon: const Icon(Icons.analytics),
              label: const Text("Generate QC Report"),
            ),
          ],
        ),
      ),
    );
  }
}
