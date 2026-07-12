import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: const Text(
          'Help & Support',
          style: TextStyle(color: AppColors.textDark, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        children: [
          const SizedBox(height: 16),
          // FAQ 1
          ExpansionTile(
            title: const Text(
              'ഇൻഡോർ മാപ് ഉപയോഗിക്കുന്ന വിധം ?',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.textDark,
              ),
            ),
            childrenPadding: const EdgeInsets.all(8.0),
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.asset(
                  'assets/imgs/Help.jpg',
                  fit: BoxFit.cover,
                ),
              ),
            ],
          ),
          const Divider(),
          // FAQ 2
          const ExpansionTile(
            title: Text(
              'ഇൻഡോർ മാപ് ലഭ്യമാവുന്ന സ്ഥലങ്ങൾ ?',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.textDark,
              ),
            ),
            childrenPadding: EdgeInsets.all(16.0),
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'MCH Block',
                  style: TextStyle(fontSize: 14, color: AppColors.textMuted),
                ),
              ),
            ],
          ),
          const Divider(),
          // Support Email Card
          const ExpansionTile(
            leading: Icon(Icons.email, color: AppColors.primary),
            title: Text(
              'Send Us An Email',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.textDark,
              ),
            ),
            childrenPadding: EdgeInsets.all(16.0),
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'hello@paadha.com',
                  style: TextStyle(
                    fontSize: 15,
                    color: Colors.blue,
                    fontWeight: FontWeight.w500,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ],
          ),
          const Divider(),
        ],
      ),
    );
  }
}
