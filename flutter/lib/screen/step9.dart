import 'package:flutter/material.dart';

class Step9Screen extends StatelessWidget {
  const Step9Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 9"),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          "This is Step 9 Screen",
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
