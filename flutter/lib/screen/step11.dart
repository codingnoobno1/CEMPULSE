import 'package:flutter/material.dart';

class Step11Screen extends StatelessWidget {
  const Step11Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 11 - Packaging"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Packaging Process Overview",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            const Text(
              "This step focuses on the packaging operations such as:\n"
              "• Packing lines monitoring\n"
              "• Bag/Jumbo/Bulk handling\n"
              "• Quality checks\n"
              "• Dispatch readiness",
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.inventory, size: 80, color: Colors.blueAccent),
                    const SizedBox(height: 16),
                    const Text(
                      "Packaging in Progress",
                      style: TextStyle(fontSize: 18),
                    ),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Packaging workflow initiated"),
                          ),
                        );
                      },
                      child: const Text("Start Packaging"),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
