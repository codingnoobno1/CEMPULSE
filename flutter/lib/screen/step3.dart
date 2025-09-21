import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class Step3Screen extends StatefulWidget {
  const Step3Screen({super.key});

  @override
  State<Step3Screen> createState() => _Step3ScreenState();
}

class _Step3ScreenState extends State<Step3Screen> {
  final Random _random = Random();
  Timer? _timer;
  int tick = 0;

  // Sensor variables
  double motorLoad = 82; // %
  double millSpeed = 850; // rpm
  double grindingPressure = 75; // bar
  double finenessCurrent = 92;
  double finenessTarget = 95;

  // History for charts
  final List<FlSpot> speedHistory = [];
  final List<FlSpot> pressureHistory = [];
  final List<FlSpot> finenessHistory = [];

  // Material composition (pie chart)
  final List<Map<String, dynamic>> materialComposition = [
    {"name": "Limestone", "value": 65.0, "color": Colors.blue},
    {"name": "Clay", "value": 20.0, "color": Colors.green},
    {"name": "Sand", "value": 10.0, "color": Colors.orange},
    {"name": "Iron Ore", "value": 5.0, "color": Colors.red},
  ];

  List<String> alerts = ["Mill performance optimal"];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 2), (_) => _simulateData());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  /// Simulates sensor readings
  void _simulateData() {
    setState(() {
      tick++;

      motorLoad = 75 + _random.nextDouble() * 15; // 75–90 %
      millSpeed = 840 + _random.nextDouble() * 20; // 840–860 rpm
      grindingPressure = 70 + _random.nextDouble() * 10; // 70–80 bar
      finenessCurrent = 90 + _random.nextDouble() * 6; // 90–96 %

      // Update histories
      speedHistory.add(FlSpot(tick.toDouble(), millSpeed));
      pressureHistory.add(FlSpot(tick.toDouble(), grindingPressure));
      finenessHistory.add(FlSpot(tick.toDouble(), finenessCurrent));

      // Keep last 20 points
      if (speedHistory.length > 20) speedHistory.removeAt(0);
      if (pressureHistory.length > 20) pressureHistory.removeAt(0);
      if (finenessHistory.length > 20) finenessHistory.removeAt(0);

      // Alerts
      alerts.clear();
      if (motorLoad > 90) {
        alerts.add("⚠️ High motor load detected");
      } else {
        alerts.add("ℹ️ Mill performance optimal");
      }
    });
  }

  /// Line chart builder
  Widget _buildLineChart(List<FlSpot> data, Color color, double minY, double maxY) {
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
            color: color,
            barWidth: 3,
            belowBarData: BarAreaData(
              show: true,
              color: color.withOpacity(0.2),
            ),
          )
        ],
      ),
    );
  }

  /// Pie chart builder
  Widget _buildPieChart() {
    return PieChart(
      PieChartData(
        sections: materialComposition.map((item) {
          return PieChartSectionData(
            value: item["value"],
            color: item["color"],
            radius: 50,
            title: "${item["name"]}\n${item["value"].toStringAsFixed(0)}%",
            titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          );
        }).toList(),
        sectionsSpace: 2,
        centerSpaceRadius: 20,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Step 3 — Raw Meal Grinding")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            // Motor Load + Mill Speed
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    // Motor Load Gauge
                    Expanded(
                      flex: 4,
                      child: Column(
                        children: [
                          const Text("Motor Load", style: TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 10),
                          Stack(
                            alignment: Alignment.center,
                            children: [
                              SizedBox(
                                width: 100,
                                height: 100,
                                child: CircularProgressIndicator(
                                  value: motorLoad / 100,
                                  strokeWidth: 8,
                                  color: motorLoad > 90
                                      ? Colors.red
                                      : (motorLoad > 85 ? Colors.orange : Colors.green),
                                ),
                              ),
                              Text("${motorLoad.toStringAsFixed(1)}%",
                                  style: const TextStyle(fontSize: 16)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    // Mill Speed Trend
                    Expanded(
                      flex: 6,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("Mill Speed Trend",
                              style: TextStyle(fontWeight: FontWeight.bold)),
                          SizedBox(
                              height: 120,
                              child: _buildLineChart(speedHistory, Colors.blue, 800, 900)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Grinding Pressure
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Grinding Pressure", style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(
                        height: 150,
                        child: _buildLineChart(pressureHistory, Colors.green, 60, 100)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Material Composition
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Material Composition",
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(height: 180, child: _buildPieChart()),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Fineness Monitoring
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Product Fineness Monitoring",
                            style: TextStyle(fontWeight: FontWeight.bold)),
                        Chip(
                          label: Text("Current: ${finenessCurrent.toStringAsFixed(1)}%"),
                          backgroundColor: finenessCurrent >= finenessTarget
                              ? Colors.green.shade100
                              : Colors.orange.shade100,
                        ),
                      ],
                    ),
                    SizedBox(
                        height: 120,
                        child: _buildLineChart(finenessHistory, Colors.purple, 85, 100)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Alerts
            if (alerts.isNotEmpty)
              Card(
                color: Colors.yellow.shade50,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Column(
                  children: alerts
                      .map((msg) => ListTile(
                            leading: Icon(
                              msg.contains("⚠️") ? Icons.warning : Icons.info,
                              color: msg.contains("⚠️") ? Colors.red : Colors.blue,
                            ),
                            title: Text(msg),
                          ))
                      .toList(),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
