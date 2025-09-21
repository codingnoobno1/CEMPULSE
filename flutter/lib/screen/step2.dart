import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:percent_indicator/percent_indicator.dart'; // ✅ fixed import

class Step2Screen extends StatefulWidget {
  const Step2Screen({super.key});

  @override
  State<Step2Screen> createState() => _Step2ScreenState();
}

class _Step2ScreenState extends State<Step2Screen> {
  final Random _random = Random();

  double currentVibration = 32.5;
  double feedRate = 125;
  double moisture = 8.5;

  List<FlSpot> vibrationHistory = [];
  List<FlSpot> feedHistory = [];

  List<Map<String, dynamic>> particleSizeDistribution = [
    {'size': '<30mm', 'percentage': 15.0},
    {'size': '30-45mm', 'percentage': 45.0},
    {'size': '45-60mm', 'percentage': 30.0},
    {'size': '>60mm', 'percentage': 10.0},
  ];

  List<Map<String, String>> alerts = [];

  Timer? _timer;
  int tick = 0;

  @override
  void initState() {
    super.initState();
    // Start simulation every 2s
    _timer = Timer.periodic(const Duration(seconds: 2), (_) => _simulateData());
  }

  void _simulateData() {
    setState(() {
      tick++;

      currentVibration = 30 + _random.nextDouble() * 15; // 30–45 Hz
      feedRate = 120 + _random.nextDouble() * 20; // 120–140 t/h
      moisture = 6 + _random.nextDouble() * 6; // 6–12 %

      vibrationHistory.add(FlSpot(tick.toDouble(), currentVibration));
      feedHistory.add(FlSpot(tick.toDouble(), feedRate));

      if (vibrationHistory.length > 20) vibrationHistory.removeAt(0);
      if (feedHistory.length > 20) feedHistory.removeAt(0);

      // Alerts
      alerts.clear();
      if (currentVibration > 40) {
        alerts.add({
          "severity": "warning",
          "message": "⚠️ High vibration detected in crusher unit"
        });
      }
      if (feedRate > 135) {
        alerts.add({
          "severity": "info",
          "message": "ℹ️ Feed rate optimized for current material type"
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Widget _buildLineChart(List<FlSpot> data, String label, Color color, double minY, double maxY) {
    return LineChart(
      LineChartData(
        minY: minY,
        maxY: maxY,
        gridData: FlGridData(show: true),
        titlesData: FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            isCurved: true,
            spots: data,
            color: color, // ✅ updated for fl_chart >= 0.55
            barWidth: 3,
            belowBarData: BarAreaData(show: true, color: color.withOpacity(0.2)),
          )
        ],
      ),
    );
  }

  Widget _buildPropertyBar(String title, double value, double max, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        LinearPercentIndicator(
          lineHeight: 8,
          percent: (value / max).clamp(0, 1),
          backgroundColor: Colors.grey.shade300,
          progressColor: color, // ✅ correct usage
          barRadius: const Radius.circular(8),
        ),
        const SizedBox(height: 4),
        Text("${value.toStringAsFixed(1)}%", style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Step 2 — Crushing & Homogenization")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Crusher Vibration
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.vibration, color: Colors.blue),
                            SizedBox(width: 6),
                            Text("Crusher Vibration"),
                          ],
                        ),
                        Chip(
                          label: Text("${currentVibration.toStringAsFixed(1)} Hz"),
                          backgroundColor: currentVibration > 40
                              ? Colors.red.shade100
                              : Colors.green.shade100,
                        ),
                      ],
                    ),
                    SizedBox(height: 200, child: _buildLineChart(vibrationHistory, "Hz", Colors.blue, 20, 50)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Feed Rate
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.scale, color: Colors.green),
                            SizedBox(width: 6),
                            Text("Feed Rate"),
                          ],
                        ),
                        Chip(
                          label: Text("${feedRate.toStringAsFixed(1)} t/h"),
                          backgroundColor: Colors.green.shade100,
                        ),
                      ],
                    ),
                    SizedBox(height: 200, child: _buildLineChart(feedHistory, "t/h", Colors.green, 100, 150)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Material Properties
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.water_drop, color: Colors.orange),
                        SizedBox(width: 6),
                        Text("Material Properties"),
                      ],
                    ),
                    const SizedBox(height: 12),

                    _buildPropertyBar("Moisture Content", moisture, 15, Colors.orange),
                    const SizedBox(height: 12),

                    const Text("Particle Size Distribution", style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),

                    Column(
                      children: particleSizeDistribution.map((item) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: _buildPropertyBar(
                            item["size"],
                            item["percentage"],
                            100,
                            Colors.blueGrey,
                          ),
                        );
                      }).toList(),
                    )
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Alerts
            if (alerts.isNotEmpty)
              Card(
                color: Colors.yellow.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Alerts", style: TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      Column(
                        children: alerts.map((a) {
                          return ListTile(
                            leading: Icon(
                              a["severity"] == "warning" ? Icons.warning : Icons.info,
                              color: a["severity"] == "warning" ? Colors.red : Colors.blue,
                            ),
                            title: Text(a["message"]!),
                          );
                        }).toList(),
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
